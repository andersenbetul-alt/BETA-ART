\set ON_ERROR_STOP off
grant usage on schema public to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
revoke update on public.profiles from authenticated;
grant update (display_name) on public.profiles to authenticated;
grant execute on all functions in schema public to authenticated;
grant usage on schema auth to authenticated; grant select on auth.users to authenticated;

insert into auth.users (id,email) values
 ('11111111-1111-1111-1111-111111111111','owner@example.com'),
 ('22222222-2222-2222-2222-222222222222','collector@example.com');
update public.profiles set role='owner' where id='11111111-1111-1111-1111-111111111111';
insert into public.works (id,title,published) values
 ('aaaaaaaa-0000-0000-0000-000000000001','Published piece',true),
 ('aaaaaaaa-0000-0000-0000-000000000002','Draft piece',false);

set role authenticated;
set request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';
\echo '--- T1 collector sees published only (expect 1)'
select count(*) from public.works;
\echo '--- T2 owner sees all (expect 2)'
set request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';
select count(*) from public.works;
set request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';
\echo '--- T3 collector write works -> expect DENIED'
insert into public.works (title,published) values ('hacked',true);
\echo '--- T4 collector sees own profile only (expect 1)'
select count(*) from public.profiles;
\echo '--- T5 SELF-PROMOTE -> expect DENIED'
update public.profiles set role='owner' where id='22222222-2222-2222-2222-222222222222';
\echo '--- T5b role after attempt (expect collector)'
reset role; select id,role from public.profiles where id='22222222-2222-2222-2222-222222222222';
set role authenticated; set request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';
\echo '--- T6 collector CAN update own display_name (expect UPDATE 1)'
update public.profiles set display_name='Ada' where id='22222222-2222-2222-2222-222222222222';
\echo '--- T7 inquiry forged under another author -> expect DENIED'
insert into public.inquiries (work_id,author_id,message)
 values ('aaaaaaaa-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','forged');
\echo '--- T8 own inquiry -> expect INSERT 1'
insert into public.inquiries (work_id,author_id,message)
 values ('aaaaaaaa-0000-0000-0000-000000000001','22222222-2222-2222-2222-222222222222','Is this available?');
