create table if not exists payments (
    id serial primary key,
    reservation_id integer not null,
    amount numeric(15,2),
    payment_method varchar(50),
    status varchar(20),
    payment_date date default CURRENT_DATE,
    foreign key (reservation_id) references reservations (id)
);