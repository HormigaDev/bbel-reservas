create table if not exists reservations (
    id serial primary key,
    user_id integer not null,
    resources_id integer not null,
    reservation_date date default CURRENT_DATE,
    start_time time default CURRENT_TIME,
    end_time time,
    status varchar(20),
    created_at timestamp default CURRENT_TIMESTAMP,
    foreign key (user_id) references users (id),
    foreign key (item_id) references resources (id)
);