use inventory_management;
create table warehouse(
w_id INT auto_increment NOT NULL Primary Key,
w_name VARCHAR(50),
w_address VARCHAR(100)
);
ALTER TABLE internal_transfers ADD COLUMN tranfer_warehouse TEXT NOT NULL REFERENCES warehouse(w_name);
