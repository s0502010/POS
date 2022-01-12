CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "gender" VARCHAR(10),
  "mobile" VARCHAR(20),
  "date_of_birth" DATE,
  "role" VARCHAR(255) NOT NULL,
  "created_at" timestamp,
  "updated_at" timestamp,
  "status" VARCHAR(255) NOT NULL
);

CREATE TABLE "pos" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "address" VARCHAR(255) NOT NULL,
  "status" VARCHAR(255) NOT NULL,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "seats" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255),
  "status" VARCHAR(255) NOT NULL,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "menu_type" (
  "id" SERIAL PRIMARY KEY,
  "type" VARCHAR(255),
  "pos_id" integer,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "menu" (
  "id" SERIAL PRIMARY KEY,
  "image" VARCHAR(255),
  "menu_type_id" integer,
  "name" VARCHAR(255),
  "description" VARCHAR(255),
  "type" VARCHAR(255) NOT NULL,
  "status" VARCHAR(255) NOT NULL,
  "price" decimal(6, 2) NOT NULL,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "ordercheck" (
  "id" SERIAL PRIMARY KEY,
  "users_id" integer,
  "pos_id" integer,
  "seats_id" integer,
  "status" VARCHAR(255) NOT NULL,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "order_item" (
  "id" SERIAL PRIMARY KEY,
  "ordercheck_id" integer,
  "food_name" text,
  "description" VARCHAR(255),
  "price" decimal(6, 2) NOT NULL,
  "quantity" INTEGER,
  "type" VARCHAR(255),
  "status" VARCHAR(255) NOT NULL,
  "created_at" timestamp,
  "updated_at" timestamp
);

ALTER TABLE "menu_type" ADD FOREIGN KEY ("pos_id") REFERENCES "pos" ("id");

ALTER TABLE "menu" ADD FOREIGN KEY ("menu_type_id") REFERENCES "menu_type" ("id");

ALTER TABLE "ordercheck" ADD FOREIGN KEY ("users_id") REFERENCES "users" ("id");

ALTER TABLE "ordercheck" ADD FOREIGN KEY ("pos_id") REFERENCES "pos" ("id");

ALTER TABLE "ordercheck" ADD FOREIGN KEY ("seats_id") REFERENCES "seats" ("id");

ALTER TABLE "order_item" ADD FOREIGN KEY ("ordercheck_id") REFERENCES "ordercheck" ("id");
