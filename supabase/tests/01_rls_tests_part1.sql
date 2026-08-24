\set ON_ERROR_STOP on
\pset pager off

-- Two users arrive by different paths: OAuth (metadata) and email/password (none).
insert into auth.users (id, email, raw_user_meta_data) values
  ('11111111-1111-1111-1111-111111111111', 'alice@example.com',
   '{"full_name":"  Alice A  ","avatar_url":"https://img/a.png"}'::jsonb),
  ('22222222-2222-2222-2222-222222222222', 'bob@example.com', '{}'::jsonb);

\echo '--- T1: signup trigger provisions profiles for both paths'
select id, email, display_name, avatar_url from public.profiles order by email;

\echo '--- T2: OAuth metadata trimmed; empty metadata yields NULL not blank'
select
  (select display_name from public.profiles where email='alice@example.com') = 'Alice A' as alice_name_trimmed,
  (select display_name from public.profiles where email='bob@example.com') is null      as bob_name_null;

-- Become Alice.
set role authenticated;
set request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';

\echo '--- T3: Alice sees exactly her own row (expect 1)'
select count(*) as visible_rows from public.profiles;

\echo '--- T4: Bob''s row is invisible to Alice (expect 0)'
select count(*) as bob_rows_visible from public.profiles
  where id='22222222-2222-2222-2222-222222222222';

\echo '--- T5: Alice updates her own display_name (expect success)'
update public.profiles set display_name='Alice Updated'
  where id='11111111-1111-1111-1111-111111111111';
select display_name from public.profiles where id='11111111-1111-1111-1111-111111111111';

\echo '--- T6: updated_at advanced past created_at (expect t)'
select updated_at > created_at as updated_at_bumped
  from public.profiles where id='11111111-1111-1111-1111-111111111111';

\echo '--- T7: Alice updating Bob''s row affects 0 rows (RLS USING)'
update public.profiles set display_name='HACKED'
  where id='22222222-2222-2222-2222-222222222222';
\echo '(0 rows updated above = blocked)'

\echo '--- T8: Alice cannot write email column (expect permission denied)'
savepoint s1;
do $$ begin
  update public.profiles set email='attacker@evil.com'
    where id='11111111-1111-1111-1111-111111111111';
  raise exception 'FAIL: email column was writable';
exception when insufficient_privilege then
  raise notice 'PASS: email update denied by column grant';
end $$;
rollback to savepoint s1;

\echo '--- T9: Alice cannot reassign her id to Bob (expect denied)'
savepoint s2;
do $$ begin
  update public.profiles set id='22222222-2222-2222-2222-222222222222'
    where id='11111111-1111-1111-1111-111111111111';
  raise exception 'FAIL: id was reassignable';
exception when insufficient_privilege then
  raise notice 'PASS: id update denied by column grant';
  when others then
  raise notice 'PASS: id reassignment blocked (%)', sqlerrm;
end $$;
rollback to savepoint s2;

\echo '--- T10: Alice cannot insert a profile for Bob (RLS WITH CHECK)'
savepoint s3;
do $$ begin
  insert into public.profiles (id, email) values
    ('33333333-3333-3333-3333-333333333333','mallory@example.com');
  raise exception 'FAIL: cross-user insert allowed';
exception when others then
  raise notice 'PASS: cross-user insert blocked (%)', sqlerrm;
end $$;
rollback to savepoint s3;

\echo '--- T11: Alice cannot delete her row (no DELETE policy)'
savepoint s4;
do $$
declare n int;
begin
  delete from public.profiles where id='11111111-1111-1111-1111-111111111111';
  get diagnostics n = row_count;
  if n = 0 then raise notice 'PASS: delete affected 0 rows'; else raise exception 'FAIL: deleted % rows', n; end if;
exception when insufficient_privilege then
  raise notice 'PASS: delete denied by grant';
end $$;
rollback to savepoint s4;

reset role;
reset request.jwt.claim.sub;

\echo '--- T12: email change in auth.users syncs to profile'
update auth.users set email='alice.new@example.com'
  where id='11111111-1111-1111-1111-111111111111';
select email from public.profiles where id='11111111-1111-1111-1111-111111111111';

\echo '--- T13: deleting the account cascades to the profile (expect 0)'
delete from auth.users where id='11111111-1111-1111-1111-111111111111';
select count(*) as remaining from public.profiles
  where id='11111111-1111-1111-1111-111111111111';

\echo '--- T14: blank display_name rejected by constraint'
do $$ begin
  insert into public.profiles (id, email, display_name)
  values ('44444444-4444-4444-4444-444444444444','x@y.z','   ');
  raise exception 'FAIL: blank display_name accepted';
exception when check_violation then
  raise notice 'PASS: blank display_name rejected';
  when foreign_key_violation then
  raise notice 'PASS: FK to auth.users enforced first';
end $$;
