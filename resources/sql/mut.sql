DROP DATABASE IF EXISTS mut;

CREATE DATABASE IF NOT EXISTS mut;

USE mut;

CREATE TABLE IF NOT EXISTS user_types (
    `id` INT(11) PRIMARY KEY AUTO_INCREMENT,
    `type` VARCHAR(10) NOT NULL UNIQUE
);

INSERT IGNORE INTO user_types(`type`) VALUES
    ("ADMIN"),
    ("CUSTOMER"),
    ("SELLER");

CREATE TABLE IF NOT EXISTS users(
    `id` INT(11) PRIMARY KEY AUTO_INCREMENT,
    `first_name` VARCHAR(15) NOT NULL,
    `last_name` VARCHAR(15) NOT NULL,
    `id_number` VARCHAR(20) NOT NULL UNIQUE,
    `id_pictures` VARCHAR(600) DEFAULT NULL,
    `dp` VARCHAR(255) DEFAULT NULL,
    `username` VARCHAR(25) UNIQUE NOT NULL,
    `email` VARCHAR(35) NOT NULL UNIQUE,
    `password` VARCHAR(256) NOT NULL,
    `user_type_id` INT(1) DEFAULT 2,
    `last_login` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_type_id) REFERENCES user_types(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS categories(
    `id` INT(3) PRIMARY KEY AUTO_INCREMENT,
    `category_name` VARCHAR(30) NOT NULL UNIQUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_categories(
    `id` INT(3) PRIMARY KEY AUTO_INCREMENT,
    `category_name` VARCHAR(15) NOT NULL UNIQUE,
    `category_id` INT(3),
    FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE SET NULL ON UPDATE CASCADE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products(
    `id` INT(3) PRIMARY KEY AUTO_INCREMENT,
    `product_name` VARCHAR(15) NOT NULL,
    `images` VARCHAR(9999),
    `seller_id` INT(11),
    `description` VARCHAR(2500),
    `minimum_price` INT(6),
    `bid_price` INT(6),
    `biddable` INT(1) DEFAULT 0,
    `product_category_id` INT(3),
    `brand` VARCHAR(10),
    `approved` INT(1) DEFAULT 0,
    `bidder_id` INT(11),
    `bidded_at` DATETIME,
    `end_time` DATETIME,
    `collected_at` DATETIME,
    `brought_at` DATETIME,
    FOREIGN KEY(bidder_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY(product_category_id) REFERENCES product_categories(id) ON DELETE SET NULL ON UPDATE CASCADE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bids(
    `id` INT(3) PRIMARY KEY AUTO_INCREMENT,
    `product_id` INT(3),
    `user_id` INT(11),
    `highest_bid` INT(6),
    `interested_customers` VARCHAR(9999) DEFAULT "",
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions(
    `id` INT(3) PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT(11),
    `transaction_code` INT(10),
    `product_id` INT(3),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS feedbacks(
    `id` INT(3) PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT(3),
    `feedback` VARCHAR(10000),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_feedbacks(
    `id` INT(3) PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT(3),
    `feedback` VARCHAR(10000),
    `product_id` INT(3),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_reports(
    `id` INT(3) PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT(3),
    `product_id` INT(3),
    `product_proof_of_ownership` VARCHAR(2000),
    `complain_explanation` VARCHAR(1000),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_preferences(
    `id` INT(3) PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT(3),
    `followers` INT(3),
    `preference` VARCHAR(9999),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications(
    `id` INT(3) PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT(3),
    `product_id` INT(3),
    `is_read` INT(1) DEFAULT 0,
    `read_at` INT(1) DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
