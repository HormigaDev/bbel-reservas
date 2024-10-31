create table if not exists users (
    id serial primary key,
    name varchar(100) not null,
    email varchar(100) unique not null,
    phone varchar(15),
    password text not null,
    role varchar(20),
    created_at timestamp default CURRENT_TIMESTAMP
);