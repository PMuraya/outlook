select 
    todo.id,
    todo.description,
    intern.email,
    datediff(now(),
    todo.start_date) as days_due
from
    todo
    inner join intern on intern.intern = todo.intern
where
     datediff(now(),
     todo.start_date) >= 5
