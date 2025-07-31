use stock_express;

create table stocks(
 sl_no int primary key,
 company_name varchar(100),
 price decimal(10,2),
 week_52_high decimal(10,2),
 week_52_low decimal(10,2)
 );
 
 
alter table stocks add constraint company_name unique (company_name);

insert into stocks values(1, "zomato", 155, 70, 165);
INSERT INTO stocks VALUES (2, "TCS", 3840, 4000, 3100);
INSERT INTO stocks VALUES (3, "Infosys", 1450, 1600, 1250);
INSERT INTO stocks VALUES (4, "Reliance", 2650, 2850, 2200);
INSERT INTO stocks VALUES (5, "HDFC Bank", 1580, 1700, 1400);
INSERT INTO stocks VALUES (6, "Wipro", 425, 470, 380);
INSERT INTO stocks VALUES (7, "ICICI Bank", 980, 1050, 860);
INSERT INTO stocks VALUES (8, "Bajaj Finance", 7200, 7800, 6000);
INSERT INTO stocks VALUES (9, "Maruti Suzuki", 10800, 11200, 9500);
INSERT INTO stocks VALUES (10, "Larsen & Toubro", 3100, 3300, 2700);
INSERT INTO stocks VALUES (11, "Hindustan Unilever", 2450, 2650, 2300);

select * from stocks;


create table holdings (
u_id int primary key,
user_name varchar(100),
company_name varchar(100),
quantity int,
buy_price decimal(10,2),
current_price decimal(10,2),
profit_loss decimal(10,2),
realised_price decimal(10,2),
constraint fk_company
foreign key(company_name) references stocks(company_name) 
);


select * from holdings;