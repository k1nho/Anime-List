-- create database and schemas

CREATE DATABASE kinanime;

CREATE TABLE anime_info(
title varchar PRIMARY KEY,
description varchar NOT NULL,
rating integer,
image_url varchar NOT NULL
);

CREATE TABLE anime_content (
inventory_number SERIAL PRIMARY KEY,
title varchar NOT NULL,
num_stock integer NOT NULL,
cost decimal NOT NULL,
format varchar NOT NULL,
FOREIGN KEY (title) REFERENCES anime_info(title)
);

CREATE TABLE users (
username varchar PRIMARY KEY,
password varchar NOT NULL,
dob varchar NOT NULL,
address varchar NOT NULL,
credit_card varchar NOT NULL,
email varchar NOT NULL
);

CREATE TABLE favorite_ass(
username varchar NOT NULL,
inventory_number integer NOT NULL,
FOREIGN KEY (username) REFERENCES users(username),
FOREIGN KEY (inventory_number) REFERENCES anime_content(inventory_number),
PRIMARY KEY (username, inventory_number)
);

CREATE TABLE rented_ass(
username varchar NOT NULL,
inventory_number integer NOT NULL,
due_date date NOT NULL,
FOREIGN KEY (username) REFERENCES users(username),
FOREIGN KEY (inventory_number) REFERENCES anime_content(inventory_number),
PRIMARY KEY (username, inventory_number)
);
