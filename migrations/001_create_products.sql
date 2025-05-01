drop table if exists products;

create table products (
    id int unsigned not null auto_increment,
    title varchar(255) not null,
    price double not null,
    description text not null,
    imageUrl varchar(255) not null,
    primary key (id),
    unique index id_unique (id asc) visible
);
