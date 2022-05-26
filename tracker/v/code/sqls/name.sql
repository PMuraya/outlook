-- user = 1119.
select name, user from mutall_users.user;
-- 
-- tenant = 42.
select tenant from rentize.tenant;
-- 
-- client = 43
select client from mutallco_rental.client;
-- 
-- cte 
with tenant as( 
    select 
        mutall_users.user.name, 
        mutall_users.user.user 
    from 
        mutall_users.user 
        inner join rentize.tenant on rentize.tenant.user = mutall_users.user.user
),
client as(
    select name from mutallco_rental.client
)
select 
    client.name as client, 
    tenant.name as tenant
from 
    client
    left join tenant on tenant.name = client.name
where tenant.name is null;
-- 
-- 
select * from mutallco_rental.client where email = 'wawerumunyi@yahoo.com';
-- 
-- 
