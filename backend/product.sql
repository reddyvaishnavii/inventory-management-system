-- Create the database
CREATE DATABASE inventory_management;

-- Switch to that database
USE inventory_management;

-- Create the products table
CREATE TABLE products (
    product_id      INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    sku             VARCHAR(100) UNIQUE NOT NULL,
    category        VARCHAR(150) NOT NULL,
    unit_of_measure VARCHAR(50) NOT NULL,
    initial_stock   INT DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
