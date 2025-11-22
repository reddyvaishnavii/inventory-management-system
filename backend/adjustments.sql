use inventory_management;

CREATE TABLE adjustments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT,
  amount INT,
  reason VARCHAR(255),
  type ENUM('Gain', 'Loss'),
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);
