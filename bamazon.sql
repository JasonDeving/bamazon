--create database
CREATE DATABASE Bamazon;
USE Bamazon;
--create a table
CREATE TABLE Product(
    ItemId INT AUTO_INCREMENT NOT NULL,
    ProductName varchar(10000),
    DepartmentName varchar(10000),
    Price DECIMAL(10,2) NULL,
    StockQuantity INT(10),
    PRIMARY KEY(ItemId)
);

CREATE TABLE Departments(
    DepartmentID INT AUTO_INCREMENT NOT NULL,
    DepartmentName VARCHAR(1000),
    OverHeadCosts INT(10),
    TotalSales INT(10),
    PRIMARY KEY(DepartmentID)
);

--dummy data into table
INSERT INTO Product (ProductName,DepartmentName,Price,StockQuantity)
VALUES ("Tennis Balls", "Sports", 5, 10),
	   ("Tennis Ratchets", "Sports", 20, 10),
       ("Tooth Brush", "Cosmetics", 1, 100),
       ("Knife", "Kitchen", 10, 5),
       ("Spoon", "Kitchen", 1, 10),
       ("Fork", "Kitchen", 1, 15),
       ("How to sew?", "Books", 20, 10),
       ("Grammar for dummies", "Books", 20, 10),
       ("Javascript for extreme dummies", "Books", 20, 10),
       ("20lbs of Rice", "food", 20, 10)
       ;
-- http://stackoverflow.com/questions/18211413/inserting-data-with-node-js
-- Subtract inventory
UPDATE Product
   SET StockQuantity = StockQuantity - 8
WHERE ItemId = 1;

--sum total revenue
SELECT DepartmentName, 
sum(OverHeadCosts) as cost, sum(TotalSales) as sales FROM 
Bamazon.Departments GROUP BY DepartmentName;

