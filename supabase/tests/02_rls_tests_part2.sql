\pset pager off
begin;
set local role authenticated;
set local request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';

\echo '--- T8: Alice cannot write the email column'
savepoint s1;
do $$ begin
  update public.profiles set email='attacker@evil.com'
    where id='11111111-1111-1111-1111-111111111111';
  raise exception 'FAIL: email column was writable';
exception when insufficient_privilege then raise notice 'PASS: email update denied by column grant';
end $$;
rollback to savepoint s1;

\echo '--- T9: Alice cannot reassign her id to Bob'
savepoint s2;
do $$ begin
  update public.profiles set id='22222222-2222-2222-2222-222222222222'
    where id='11111111-1111-1111-1111-111111111111';
  raise exception 'FAIL: id was reassignable';
exception when insufficient_privilege then raise notice 'PASS: id update denied by column grant';
        when others then raise notice 'PASS: id reassignment blocked (%)', sqlerrm;
end $$;
rollback to savepoint s2;

\echo '--- T10: Alice cannot insert a profile for someone else'
savepoint s3;
do $$ begin
  insert into public.profiles (id, email) values
    ('33333333-3333-3333-3333-333333333333','mallory@example.com');
  raise exception 'FAIL: cross-user insert allowed';
exception when others then raise notice 'PASS: cross-user insert blocked (%)', sqlerrm;
end $$;
rollback to savepoint s3;

\echo '--- T11: Alice cannot delete her row (no DELETE policy)'
savepoint s4;
do $$
declare n int;
begin
  delete from public.profiles where id='11111111-1111-1111-1111-111111111111';
  get diagnostics n = row_count;
  if n = 0 then raise notice 'PASS: delete affected 0 rows';
  else raise exception 'FAIL: deleted % rows', n; end if;
exception when insufficient_privilege then raise notice 'PASS: delete denied by grant';
end $$;
rollback to savepoint s4;

commit;

\echo '--- T12: email change in auth.users syncs to the profile'
update auth.users set email='alice.new@example.com'
  where id='11111111-1111-1111-1111-111111111111';
select email as profile_email from public.profiles
  where id='11111111-1111-1111-1111-111111111111';

\echo '--- T13: account deletion cascades to profile (expect 0)'
delete from auth.users where id='11111111-1111-1111-1111-111111111111';
select count(*) as remaining from public.profiles
  where id='11111111-1111-1111-1111-111111111111';

\echo '--- T14: blank display_name rejected'
do $$ begin
  insert into auth.users (id,email) values ('44444444-4444-4444-4444-444444444444','x@y.z');
  update public.profiles set display_name='   ' where id='44444444-4444-4444-4444-444444444444';
  raise exception 'FAIL: blank display_name accepted';
exception when check_violation then raise notice 'PASS: blank display_name rejected by constraint';
end $$;

\echo '--- T15: anon role sees nothing'
set role anon;
do $$
declare n int;
begin
  select count(*) into n from public.profiles;
  raise notice 'FAIL: anon read % rows', n;
exception when insufficient_privilege then raise notice 'PASS: anon has no SELECT grant';
end $$;
reset role;
