DROP DATABASE IF EXISTS `auctions`;
CREATE DATABASE IF NOT EXISTS `auctions`;
USE `auctions`;
CREATE TABLE IF NOT EXISTS `Users` (
`UserID` VARCHAR(36) PRIMARY KEY,
`Username` VARCHAR(50) NOT NULL,
`Password` VARCHAR(50) NOT NULL,
`Birth_Date` DATE NOT NULL,
`Email` VARCHAR(35) NOT NULL
);
DELIMITER $$
CREATE TRIGGER `set_user_id` BEFORE INSERT ON `Users`
FOR EACH ROW
BEGIN
    SET NEW.`UserID` = UUID();
END$$
DELIMITER ;
INSERT INTO `Users` (`Username`, `Password`, `Birth_Date`, `Email`) VALUES
('XBagrenoGamer', 'changeme', '1800-01-01', 'daniele.dianda@polofermigiorgi.it'),
('LucianoTechTips', 'changeme', '1958-04-09', 'luciano.carlotti@polofermigiorgi.it'),
('Cabumy', 'changeme', '2004-09-30', 'dragosolteanu04@gmail.com'),
('Lesione', 'changeme', '2003-04-09', 'lucalencioni09@gmail.com');
CREATE TABLE IF NOT EXISTS `Items` (
`ItemID` INT PRIMARY KEY AUTO_INCREMENT,
`Image_URL` VARCHAR(300) DEFAULT 'assets/unavailable-image.jpg',
`Item_Name` VARCHAR(50) NOT NULL,
`Item_Description` VARCHAR(300) DEFAULT "No item description",
`Highest_Bidder` VARCHAR(36) DEFAULT NULL,
`Minimum_Bid` FLOAT DEFAULT 0.01,
`Current_Bid` FLOAT DEFAULT NULL,
`Seller` VARCHAR(50) DEFAULT 'Anonymous',
`Bid_Address` VARCHAR(24),
`Expire_Date` DATETIME DEFAULT (NOW() + INTERVAL 7 DAY),
FOREIGN KEY (`Highest_Bidder`) REFERENCES `Users`(`UserID`)
);
CREATE TRIGGER `generate_bid_address` BEFORE INSERT ON `Items`
FOR EACH ROW
BEGIN
    DECLARE last_bid_address VARCHAR(24);
    SELECT `Bid_Address` INTO last_bid_address FROM `Items` ORDER BY `ItemID` DESC LIMIT 1;
    IF last_bid_address IS NULL THEN
        SET NEW.`Bid_Address` = '224.0.0.1';
    ELSE
        SET @last_octet = CAST(SUBSTRING_INDEX(last_bid_address, '.', -1) AS UNSIGNED);
        IF @last_octet = 255 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Maximum Class D IP Address range has been reached';
        ELSE
            SET @next_octet = @last_octet + 1;
            SET NEW.`Bid_Address` = CONCAT('224.0.0.', @next_octet);
        END IF;
    END IF;
END;
INSERT INTO `items` (`Image_URL`,`Item_Name`,`Item_Description`) VALUES
('assets/magdonal.png','Big Mag',"Viene dal Mag Donal"),
('assets/nutella.png','Nutella',"Barattolo di Nutella, Grosso"),
('assets/coca-cola.png','Coca Cola',"Una bottiglia di Coca e anche un pochino cola"),
('assets/gocciole.png','Gocciole',"Un pacchetto di gocciole al caramello"),
('assets/pen-mod.png','Penna Roteante',"La penna che fa il divertente");
INSERT INTO `items` (`Item_Name`,`Seller`,`Expire_Date`) VALUES
('Zappa da Vigna','Enrico Pasquale Pratticò','2023-04-29 00:00:00');
