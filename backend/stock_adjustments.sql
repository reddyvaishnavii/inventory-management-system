use inventory_management;

-- Stock Adjustments Table
CREATE TABLE stock_adjustments (
    adjustment_id     INT AUTO_INCREMENT PRIMARY KEY,
    product_id        INT NOT NULL,
    location_name     VARCHAR(150) NOT NULL,
    recorded_quantity INT NOT NULL,
    counted_quantity  INT NOT NULL,
    difference        INT AS (counted_quantity - recorded_quantity) STORED,
    reason            VARCHAR(255),
    adjusted_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (product_id) REFERENCES products(product_id)
);
