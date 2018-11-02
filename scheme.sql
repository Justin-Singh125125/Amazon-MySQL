DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
    item_id INTEGER(10)UNIQUE NULL,
    product_name VARCHAR(40) NULL,
    department_name VARCHAR(40) NULL,
    price DECIMAL(10,2)NULL,
    stock_quantity INTEGER(10) NULL,
    primary key(item_id)
)
SELECT * FROM products;