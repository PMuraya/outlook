
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
                    if(user > 229 and user <= 1208, 'wanabiashara',
                        if(user > 1208 and user <= 1254, 'mutall_rental', 'mutall_data')
                 )
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