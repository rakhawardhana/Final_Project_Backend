create database coffee_ex_machine;

use coffee_ex_machine;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(50) NOT NULL UNIQUE,
    gender ENUM('Male', 'Female') NOT NULL,
    password VARCHAR(50) NOT NULL,
    avatar VARCHAR(255),
    verified BOOLEAN DEFAULT FALSE,
	created_at timestamp null default current_timestamp,
	updated_at timestamp null default current_timestamp
			on update current_timestamp
);

CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT(11) NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category(id),
    name_product VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    price INT(11) NOT NULL,
    quantity INT(8) NOT NULL DEFAULT 1,
    avatar VARCHAR(255) NOT NULL,
	created_at timestamp null default current_timestamp,
	updated_at timestamp null default current_timestamp
			on update current_timestamp
);

select * from products;

CREATE TABLE category (
	id INT PRIMARY KEY AUTO_INCREMENT,
    category_product VARCHAR(50) NOT NULL
);

CREATE TABLE admin(
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(50) NOT NULL,
    created_at timestamp null default current_timestamp,
	updated_at timestamp null default current_timestamp
			on update current_timestamp
);

CREATE TABLE cart(
id INT(11) PRIMARY KEY AUTO_INCREMENT,
users_id INT(11) NOT NULL,
	FOREIGN KEY (users_id) REFERENCES users(id),
created_at timestamp null default current_timestamp,
updated_at timestamp null default current_timestamp
			on update current_timestamp
);

CREATE TABLE cart_product(
cart_id INT(11) NOT NULL, 
	FOREIGN KEY (cart_id) REFERENCES cart(id),
product_id INT(11) NOT NULL, 
	FOREIGN KEY (product_id) REFERENCES products(id),
quantity INT(11) NOT NULL
);

CREATE TABLE checkout(
id INT(11) PRIMARY KEY AUTO_INCREMENT,
cart_id INT(11) NOT NULL, 
	FOREIGN KEY (cart_id) REFERENCES cart(id),
admin_id INT(11) NOT NULL,
	FOREIGN KEY (admin_id) REFERENCES admin(id),
price_sum INT(11) NOT NULL, 
receipt VARCHAR(50),
verified ENUM ('y', 'n') NOT NULL, 
created_at timestamp null default current_timestamp,
updated_at timestamp null default current_timestamp
			on update current_timestamp


);

INSERT INTO category(category_product) VALUES ('Automatic'),('Manual-brew'),('Grinder');

alter table products modify avatar varchar(225) null;

alter table users drop verified;

alter table users modify password varchar(225);

select * from users;
select *
from products 
join category on products.category_id = category.id;

select * from cart;
select * from products;
select * from cart_product;

