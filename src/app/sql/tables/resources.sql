create table if not exists resources (
    id serial primary key,
    name varchar(100) unique not null,
    description text,
    price numeric(15,2)
);