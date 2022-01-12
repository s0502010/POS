drop database pos_system;
create database pos_system;
\c pos_system;

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(50),
  "password" VARCHAR(255),
  "gender" VARCHAR(10),
  "mobile" VARCHAR(20),
  "date_of_birth" DATE,
  "role" VARCHAR(255),
  "created_at" timestamp default current_timestamp,
  "updated_at" timestamp,
  "status" VARCHAR(255)
);

CREATE TABLE "pos" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255),
  "address" VARCHAR(255),
  "status" VARCHAR(255),
  "created_at" timestamp default current_timestamp,
  "updated_at" timestamp
);

CREATE TABLE "seats" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255),
  "status" VARCHAR(255),
  "created_at" timestamp default current_timestamp,
  "updated_at" timestamp
);

CREATE TABLE "menu_type" (
  "id" SERIAL PRIMARY KEY,
  "type" VARCHAR(255),
  "pos_id" integer,
  "created_at" timestamp default current_timestamp,
  "updated_at" timestamp
);

CREATE TABLE "menu" (
  "id" SERIAL PRIMARY KEY,
  "image" VARCHAR(255),
  "menu_type_id" integer,
  "name" VARCHAR(255),
  "description" VARCHAR(255),
  "type" VARCHAR(255),
  "status" VARCHAR(255),
  "price" decimal(6, 2),
  "created_at" timestamp default current_timestamp,
  "updated_at" timestamp
);

CREATE TABLE "ordercheck" (
  "id" SERIAL PRIMARY KEY,
  "users_id" integer,
  "pos_id" integer,
  "seats_id" integer,
  "status" VARCHAR(255),
  "created_at" timestamp default current_timestamp,
  "updated_at" timestamp
);

CREATE TABLE "order_item" (
  "id" SERIAL PRIMARY KEY,
  "ordercheck_id" integer,
  "seat_id" integer,
  "food_name" varchar(225),
  "description" VARCHAR(255),
  "price" decimal(6, 2),
  "quantity" INTEGER,
  "type" VARCHAR(255),
  "status" VARCHAR(255),
  "created_at" timestamp default current_timestamp,
  "updated_at" timestamp
);

ALTER TABLE "menu_type" ADD FOREIGN KEY ("pos_id") REFERENCES "pos" ("id");

ALTER TABLE "menu" ADD FOREIGN KEY ("menu_type_id") REFERENCES "menu_type" ("id");

ALTER TABLE "ordercheck" ADD FOREIGN KEY ("users_id") REFERENCES "users" ("id");

ALTER TABLE "ordercheck" ADD FOREIGN KEY ("pos_id") REFERENCES "pos" ("id");

ALTER TABLE "ordercheck" ADD FOREIGN KEY ("seats_id") REFERENCES "seats" ("id");

ALTER TABLE "order_item" ADD FOREIGN KEY ("ordercheck_id") REFERENCES "ordercheck" ("id");

ALTER TABLE "order_item" ADD FOREIGN KEY ("seat_id") REFERENCES "seats" ("id");

do $$
begin
   for num in 1..60 loop
   insert into seats  (name,status) VALUES (CONCAT('table-', num),'free');
   end loop;
end; $$

insert into seats  (name,status) VALUES ('table-1','free');
insert into seats  (name,status) VALUES ('table-2','free');
insert into seats  (name,status) VALUES ('table-3','free');
insert into seats  (name,status) VALUES ('table-4','free');
insert into seats  (name,status) VALUES ('table-5','free');
insert into seats  (name,status) VALUES ('table-6','free');
insert into seats  (name,status) VALUES ('table-7','free');
insert into seats  (name,status) VALUES ('table-8','free');
insert into seats  (name,status) VALUES ('table-9','free');
insert into seats  (name,status) VALUES ('table-10','free');
insert into seats  (name,status) VALUES ('table-11','free');
insert into seats  (name,status) VALUES ('table-12','free');
insert into seats  (name,status) VALUES ('table-13','free');
insert into seats  (name,status) VALUES ('table-14','free');
insert into seats  (name,status) VALUES ('table-15','free');
insert into seats  (name,status) VALUES ('table-16','free');
insert into seats  (name,status) VALUES ('table-17','free');
insert into seats  (name,status) VALUES ('table-18','free');
insert into seats  (name,status) VALUES ('table-19','free');
insert into seats  (name,status) VALUES ('table-20','free');
insert into seats  (name,status) VALUES ('table-21','free');
insert into seats  (name,status) VALUES ('table-22','free');
insert into seats  (name,status) VALUES ('table-23','free');
insert into seats  (name,status) VALUES ('table-24','free');


update users set role = 'admin' where id = 1;

SELECT * from menu_type;
SELECT id, name, price, type, image from menu;


SELECT mt.type,
JSON_AGG(mu.name)
FROM menu_type mt
JOIN menu mu ON mt.type = mu.type
GROUP by mt.type;


SELECT mt.type,
JSON_AGG(
  json_object_agg(
    'name' , mu.name,
  )
)
FROM menu_type mt
JOIN menu mu ON mt.type = mu.type
GROUP by mt.type;