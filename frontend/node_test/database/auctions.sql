-- Active: 1666777883042@@localhost@3306@auctions
DROP DATABASE IF EXISTS auctions;
CREATE DATABASE IF NOT EXISTS auctions;
USE auctions;
CREATE TABLE IF NOT EXISTS Customers (
CustomerID INT PRIMARY KEY AUTO_INCREMENT,
First_Name VARCHAR(50) NOT NULL,
Last_Name VARCHAR(50) NOT NULL,
Birth_Date DATE NOT NULL,
Billing_Address VARCHAR(50) NOT NULL,
Email VARCHAR(35) NOT NULL,
Payment_Info VARCHAR(50) NOT NULL
);
INSERT INTO Customers(CustomerID, First_Name, Last_Name, Birth_Date, Billing_Address, Email, Payment_Info)
VALUES
(1, 'John', 'Doe', '1985-05-01', '123 Main St', 'johndoe@email.com', 'Visa'),
(2, 'Jane', 'Doe', '1990-10-23', '456 Elm St', 'janedoe@email.com', 'Mastercard'),
(3, 'Bob', 'Smith', '1978-02-14', '789 Oak St', 'bobsmith@email.com', 'Discover'),
(4, 'Sara', 'Johnson', '1989-09-03', '321 Maple St', 'sarajohnson@email.com', 'American Express'),
(5, 'Tom', 'Williams', '1982-12-11', '654 Birch St', 'tomwilliams@email.com', 'Paypal'),
(6, 'Emily', 'Brown', '1995-06-22', '987 Pine St', 'emilybrown@email.com', 'Venmo'),
(7, 'Michael', 'Davis', '1987-08-16', '741 Cedar St', 'michaeldavis@email.com', 'Apple Pay'),
(8, 'Jessica', 'Garcia', '1992-03-29', '369 Spruce St', 'jessicagarcia@email.com', 'Cash'),
(9, 'Daniel', 'Martinez', '1980-11-08', '852 Oakwood St', 'danielmartinez@email.com', 'Bitcoin'),
(10, 'Carlo Maria', 'Motta', '2003-07-07', 'Via Verdi 7', 'carlo.motta@polofermigiorgi.it', 'Google Wallet'),
(11, 'Alexander','Strengths','1960-05-06','Via Garibaldi 106','alessandro.forti@polofermigiorgi.it','Cash'),
(12, 'Luciano','Carlotti','1959-04-09' ,'Via Vecchia 96','luciano.carlotti@polofermigiorgi.it','Paypal');

CREATE TABLE IF NOT EXISTS Items (
ItemID INT PRIMARY KEY AUTO_INCREMENT,
Image_URL VARCHAR(300) DEFAULT 'assets/unavailable-image.jpg',
Item_Name VARCHAR(50) NOT NULL,
Item_Description VARCHAR(300),
Highest_Bidder INT DEFAULT NULL,
Minimum_Bid BIGINT DEFAULT 0,
Current_Bid BIGINT DEFAULT NULL,
Seller VARCHAR(50) DEFAULT 'Anonymous',
Bid_Address VARCHAR(24) NOT NULL,
FOREIGN KEY (Highest_Bidder) REFERENCES Customers(CustomerID)
);

INSERT INTO `items` (`Image_URL`,`Item_Name`,`Item_Description`,`Bid_Address`) VALUES
('assets/magdonal.png','Big Mag',"Viene dal Mag Donal","230.0.0.1"),
('assets/nutella.png','Nutella',"Barattolo di Nutella, Grosso","230.0.0.2"),
('assets/coca-cola.png','Coca Cola',"Una bottiglia di coca","230.0.0.3"),
('assets/gocciole.png','Gocciole',"Un pacchetto di gocciole al caramello","230.0.0.4"),
('assets/gocciole.png','Gocciole',"Un pacchetto di gocciole al caramello","230.0.0.4"),
('assets/gocciole.png','Gocciole',"Un pacchetto di gocciole al caramello","230.0.0.4"),
('assets/gocciole.png','Gocciole',"Un pacchetto di gocciole al caramello","230.0.0.4"),

('assets/pen-mod.png','Penna Roteante',"La penna che fa il divertente","230.0.0.5");

