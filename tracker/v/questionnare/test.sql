select 
        client.name 
    as 
        client_name, service.name 
    as 
        service_name, subscription.amount  
from subscription 
    inner join client on subscription = client.client 
    inner join service on subscription = service.service;

select 
    uid,is_psuedo, title, floor, wing, width_ft, width_inch, breadth_ft, breadth_inch, area_sq_m, area_sq_ft 
from room;