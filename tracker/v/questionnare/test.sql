
-- 
with
    datar as(
        select 
           `member`.`user`,
           `member`.business,
           `user`.`email`,
            `business`.`id`
        from 
            `member`
            inner join `business` on `member`.`business` = business.business
            inner join `user` on member = `user`.`user`
        where
            member.`user` = 261 
    )
    select subscription.`user` from subscription inner join datar on subscription.`user` = `datar`.`user`;
--    
        