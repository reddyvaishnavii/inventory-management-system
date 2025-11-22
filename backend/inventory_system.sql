-- Switch to that database
USE inventory_management;

-- Internal Transfers Table
CREATE TABLE internal_transfers (
    transfer_id      INT AUTO_INCREMENT PRIMARY KEY,
    product_id       INT NOT NULL,
    from_location    VARCHAR(150) NOT NULL,
    to_location      VARCHAR(150) NOT NULL,
    quantity_moved   INT NOT NULL,
    transfer_date    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign key linking to the products table
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

