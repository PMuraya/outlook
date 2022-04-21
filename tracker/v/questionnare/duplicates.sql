--More valid duplicate cleaner
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

