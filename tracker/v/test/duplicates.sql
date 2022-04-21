--Isolating user records with duplicate names.
with 
    duplicates as (
        select 
            `name`, 
            count(`user`) 
        from `user` 
        group by `name` 
        having count(`user`)>1
    )
select 
    `user`.* 
from `user` 
    inner join `duplicates` on `user`.`name` = duplicates.`name` order by `user`.`name`;

-- Create the member table
insert into member (user, business)
-- encode the user column to get the business column.
with
    usr as (
        select 
            `user`.`user`,
            `user`.`name`,
            if(user <= 167, 'wanamlima', 
                if(user > 167 and user <= 229, 'mutall_data',
                    if(user > 229 and user <= 1208, 'wanabiashara', 'mutall_rental')
                )
            ) as business
        from `user` 
        order by `user`
    ),
    member as(
        select 
            usr.`user`,
            business.business
        from 
            usr 
            inner join business on usr.business = business.id
    ) 
select * from member;