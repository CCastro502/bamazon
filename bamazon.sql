DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;
CREATE TABLE products (
	item_id INT AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bananas", "Produce Department", 1.50, 300),
	("Oranges", "Produce Department", 2.00, 125),
	("Strawberries", "Produce Department", 5.00, 200),
	("Lightsaber", "Toy Department", 10.00, 30),
	("Princess Barbie", "Toy Department", 7.50, 80),
	("Ken Barbie", "Toy Department", 7.50, 15),
	("Fishing Rod", "Hunting & Fishing Department", 60.00, 20),
	("Live Worms", "Hunting & Fishing Department", 1.00, 30),
	("Tackle Box", "Hunting & Fishing Department", 15.00, 20),
	("Lawn Chair", "Miscellaneous Department", 9.99, 10);

SELECT * FROM products;