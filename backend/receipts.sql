use inventory_management;

CREATE TABLE receipts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    receipt_number VARCHAR(50) NOT NULL UNIQUE,
    supplier_name VARCHAR(255) NOT NULL,
    status ENUM('Draft', 'Waiting', 'Ready', 'Done', 'Canceled') DEFAULT 'Draft',
    total_items INT DEFAULT 0,
    total_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);