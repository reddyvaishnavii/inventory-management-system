-- Delivery Orders (Outgoing Goods) Table
CREATE TABLE delivery_orders (
    delivery_id      INT AUTO_INCREMENT PRIMARY KEY,
    delivery_number  VARCHAR(50) NOT NULL UNIQUE,

    product_id       INT NOT NULL,
    customer_name    VARCHAR(255) NOT NULL,

    quantity         INT NOT NULL,
    status           ENUM('Draft', 'Picking', 'Packed', 'Delivered', 'Canceled') DEFAULT 'Draft',

    delivery_date    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign key linking to products table
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);
