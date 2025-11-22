CREATE TABLE internal_transfer (
  transfer_id INT AUTO_INCREMENT PRIMARY KEY,
  from_location VARCHAR(255) NOT NULL,
  to_location VARCHAR(255) NOT NULL,
  description TEXT,
  transfer_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
ALTER table internal_transfer ADD COLUMN prod_id INT REFERENCES prducts(prod_id);
ALTER table products ADD COLUMN warehouse INT REFERENCES warehouse(w_id);
ALTER TABLE internal_transfer ADD COLUMN status VARCHAR(20);
