-- =============================================================================
-- Kritik iş kuralları — uygulama katmanında değil, veritabanında.
-- Nedeni: kredi düşme ve erişim kontrolü yarış koşullarına açıktır. İki eşzamanlı
-- istek aynı krediyi iki kez harcayabilir. Bu mantık tek yerde ve kilitli olmalı.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Erişim kontrolü. Uygulamanın sorduğu tek soru budur.
-- -----------------------------------------------------------------------------
create or replace function has_entitlement(p_account uuid, p_feature text)
returns boolean
language sql stable as $$
  select exists (
    select 1 from entitlement
     where account_id  = p_account
       and feature_key = p_feature
       and revoked_at is null
       and (expires_at is null or expires_at > now())
  );
$$;

-- -----------------------------------------------------------------------------
-- Kredi düşme.
--   * Idempotent: aynı request_id ikinci kez düşmez (retry / çift tıklama).
--   * FIFO: önce süresi dolacak kova harcanır, kullanılmadan yanmasın diye.
--   * Kilitli: eşzamanlı istekler aynı krediyi iki kez harcayamaz.
--   * İzlenebilir: hangi kovadan ne düştüğü credit_allocation'da durur.
-- -----------------------------------------------------------------------------
create or replace function consume_credits(
  p_account    uuid,
  p_operation  text,
  p_request_id text
) returns table (charged integer, balance bigint)
language plpgsql as $$
declare
  v_cost      integer;
  v_available bigint;
  v_needed    integer;
  v_take      integer;
  v_consumption uuid;
  v_grant     record;
begin
  -- 1. Idempotency: bu istek daha önce işlendiyse tekrar düşme.
  select id, credits into v_consumption, v_cost
    from credit_consumption where request_id = p_request_id;
  if found then
    return query
      select v_cost, coalesce((select cb.balance from credit_balance cb
                                where cb.account_id = p_account), 0::bigint);
    return;
  end if;

  -- 2. Operasyon fiyatı
  select credits into v_cost
    from credit_operation where code = p_operation and active;
  if not found then
    raise exception 'bilinmeyen operasyon: %', p_operation
      using errcode = 'check_violation';
  end if;

  -- 3. Kovaları kilitle (sıra sabit: deadlock önler)
  perform 1 from credit_grant
    where account_id = p_account and remaining > 0
      and (expires_at is null or expires_at > now())
    order by expires_at nulls last, created_at
    for update;

  select coalesce(sum(remaining), 0) into v_available
    from credit_grant
   where account_id = p_account and remaining > 0
     and (expires_at is null or expires_at > now());

  if v_available < v_cost then
    raise exception 'yetersiz kredi: gerekli %, mevcut %', v_cost, v_available
      using errcode = 'insufficient_privilege';
  end if;

  -- 4. Tüketimi kaydet
  insert into credit_consumption (account_id, operation, credits, request_id)
  values (p_account, p_operation, v_cost, p_request_id)
  returning id into v_consumption;

  -- 5. FIFO dağıtım: önce süresi dolacak kova
  v_needed := v_cost;
  for v_grant in
    select id, remaining from credit_grant
     where account_id = p_account and remaining > 0
       and (expires_at is null or expires_at > now())
     order by expires_at nulls last, created_at
  loop
    exit when v_needed = 0;
    v_take := least(v_needed, v_grant.remaining);

    update credit_grant set remaining = remaining - v_take where id = v_grant.id;
    insert into credit_allocation (consumption_id, grant_id, credits)
    values (v_consumption, v_grant.id, v_take);

    v_needed := v_needed - v_take;
  end loop;

  return query
    select v_cost, coalesce((select cb.balance from credit_balance cb
                              where cb.account_id = p_account), 0::bigint);
end;
$$;

-- -----------------------------------------------------------------------------
-- Dönem kredisi verme. Abonelik yenilendiğinde webhook bunu çağırır.
-- Kredi dönem sonunda yanar; satın alınan kredi (expires_at null) yanmaz.
-- source_id + dönem başı tekil: aynı dönem iki kez kredi almaz.
-- -----------------------------------------------------------------------------
create or replace function grant_period_credits(p_subscription uuid)
returns integer
language plpgsql as $$
declare
  v_sub     record;
  v_credits integer;
begin
  select s.*, p.credits_per_period into v_sub
    from subscription s join product p on p.id = s.product_id
   where s.id = p_subscription;

  if not found or v_sub.credits_per_period is null then
    return 0;
  end if;

  -- Bu dönem için zaten verilmişse tekrar verme.
  if exists (
    select 1 from credit_grant
     where source = 'subscription_period'
       and source_id = p_subscription
       and created_at >= v_sub.current_period_start
  ) then
    return 0;
  end if;

  v_credits := v_sub.credits_per_period;

  insert into credit_grant (account_id, source, source_id, amount, remaining, expires_at)
  values (v_sub.account_id, 'subscription_period', p_subscription,
          v_credits, v_credits, v_sub.current_period_end);

  return v_credits;
end;
$$;
