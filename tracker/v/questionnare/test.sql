 with
                aclient as (
                    select distinct
                    client.client,
                        client.name
                    from 
                        client
                        inner join agreement on agreement.client=client.client
                    where
                        agreement.terminated is NULL and agreement.valid
                ),
                bal as(
                    select 
                        invoice.client,
                        period.month as mon,
                        period.year as yr,
                        closing_balance.amount
                    from 
                        closing_balance 
                        inner join invoice on closing_balance.invoice= invoice.invoice
                        inner join period on invoice.period= period.period
                ),
                current_bal as(
                    select bal.*
                    from bal
                    where mon= MONTH(DATE_SUB(CURDATE(),INTERVAL 1 MONTH))and 
                            yr =YEAR((DATE_SUB(CURDATE(),INTERVAL 1 MONTH)))  
                ),
                bal_3 as(
                    select bal.*
                    from bal
                    where mon= MONTH(DATE_SUB(CURDATE(),INTERVAL 3 MONTH))and
                            yr=YEAR(DATE_SUB(CURDATE(),INTERVAL 3 MONTH))
                ),
                bal_6 as(
                    select *
                    from bal
                    where mon= MONTH(DATE_SUB(CURDATE(),INTERVAL 6 MONTH))and
                        yr=YEAR(DATE_SUB(CURDATE(), INTERVAL 6 MONTH))
                ),
                bal_12 as(
                    select *
                    from bal
                    where mon= MONTH(DATE_SUB(CURDATE(),INTERVAL 1 YEAR))and
                        yr=YEAR(DATE_SUB(CURDATE(),INTERVAL 1 YEAR))
                ),
                D1 as(
                    select
                        bal_12.client,
                        (bal_6.amount-bal_12.amount) as amount
                    from bal_12
                        inner join bal_6 on bal_6.client= bal_12.client
                ),
                D2 as(
                    select
                        bal_6.client,
                        (bal_3.amount-bal_6.amount) as amount
                    from bal_6
                        inner join bal_3 on bal_3.client=bal_6.client
                ),
                D3 as(
                    select 
                        bal_3.client,
                        (current_bal.amount- bal_3.amount) as amount
                    from bal_3
                        inner join current_bal on current_bal.client=bal_3.client
                )
            
                select
                aclient.client,
                aclient.name,
                bal_12.amount as debt_older_than_1yr,
                D1.amount as 12_months6_months,
                D2.amount as 6_months3_months,
                D3.amount as 3_monthsnow,
                current_bal.amount as current_balance
            from aclient
                join bal_12 on bal_12.client=aclient.client
                join D1 on D1.client=aclient.client
                join D2 on D2.client=aclient.client
                join D3 on D3.client=aclient.client
                join current_bal on current_bal.client=aclient.client
            order by client ASC;