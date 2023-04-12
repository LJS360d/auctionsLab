#DROP DATABASE IF EXISTS `auctions`;
CREATE DATABASE IF NOT EXISTS `auctions`;
USE `auctions`;
CREATE TABLE IF NOT EXISTS `Users` (
`UserUUID` VARCHAR(36) PRIMARY KEY,
`Username` VARCHAR(50) NOT NULL,
`Password` VARCHAR(50) NOT NULL,
`Birth_Date` DATE NOT NULL,
`Email` VARCHAR(35) NOT NULL
);
DELIMITER $$
CREATE TRIGGER IF NOT EXISTS `set_user_id` BEFORE INSERT ON `Users`
FOR EACH ROW
BEGIN
    SET NEW.`UserUUID` = UUID();
END$$
DELIMITER ;
CREATE TABLE IF NOT EXISTS `Items` (
`ItemID` INT PRIMARY KEY AUTO_INCREMENT,
`Categories` JSON,
`Image_URL` VARCHAR(300) DEFAULT 'assets/unavailable-image.jpg',
`Item_Name` VARCHAR(50) NOT NULL,
`Item_Description` VARCHAR(300) DEFAULT "No item description",
`Highest_Bidder` VARCHAR(36) DEFAULT NULL,
`Minimum_Bid` FLOAT DEFAULT 0.00,
`Current_Bid` FLOAT DEFAULT NULL,
`Seller` VARCHAR(50) DEFAULT 'Anonymous',
`Bid_Address` VARCHAR(24),
`Expire_Date` DATETIME DEFAULT (NOW() + INTERVAL 7 DAY),
FOREIGN KEY (`Highest_Bidder`) REFERENCES `Users`(`UserUUID`)
);
CREATE TRIGGER IF NOT EXISTS `generate_bid_address` BEFORE INSERT ON `Items`
FOR EACH ROW
BEGIN
    DECLARE last_bid_address VARCHAR(24);
    SELECT `Bid_Address` INTO last_bid_address FROM `Items` ORDER BY `ItemID` DESC LIMIT 1;
    IF last_bid_address IS NULL THEN
        SET NEW.`Bid_Address` = '224.0.0.2';
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
INSERT INTO `items` (`Categories`,`Image_URL`,`Item_Name`,`Seller`,`Expire_Date`) VALUES
('{"Farming_Tools":"Hoe"}','https://cpad.ask.fm/959/738/760/-339996970-1sh2h18-fg29p33p1im5m6k/original/file.jpg','Zappa da Vigna','Enrico Pasquale Prattico\'','2023-04-29 00:00:00');
INSERT INTO `items` (`Categories`,`Image_URL`,`Item_Name`,`Item_Description`,`Seller`,`Expire_Date`) VALUES
('{"Kitchen_Utensils":"Grater"}','https://images.eprice.it/nobrand/0/Lightbox/100/302170100/lagostina_rape_4_faces_012335120100.jpg','La Grattugia','La Gratuggia quella per il forrmagggio','Giuseppe Simone','2023-04-20 10:30:00'),
('{"Food":["Chocolate","Nuts"],"MrBeast":"Feastables"}','https://cdn.shopify.com/s/files/1/0551/6060/2784/products/DN-Mobile.png','Deez Nutz',"The biggest thing jimmy has ever made",'Mr Beaaaaaast','2023-04-10T22:46:53');
INSERT INTO `items` (`Categories`,`Image_URL`,`Item_Name`) VALUES
('{"Music":["Vynil","Weeb","Rock"],"Anime":"Evangelion","Original_Soundtrack":"Neon Genesis Evangelion"}','https://cdn.hmv.com/r/w-640/hmv/files/02/02492df6-39b6-4264-bb48-12d47110f837.jpg',
'Vinile di Evangelion'),
('{"Toys":["Fidget","Relax"]}',"https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/71MYj9X7cOL._AC_SL1500_.jpg",
"Infinity Cube"),
('{"Toys":["Fidget","Puzzle"],"Puzzles":"Rubiks"}',"http://www.rubiksplace.com/images/best-speedcubes/yuxin-5x5-speedcube.png",
"5x5 Cube");

CREATE TABLE IF NOT EXISTS `Expired-Items` (
  `ItemID` INT PRIMARY KEY,
  `Categories` JSON,
  `Image_URL` VARCHAR(300),
  `Item_Name` VARCHAR(50) NOT NULL,
  `Item_Description` VARCHAR(300),
  `Winner` VARCHAR(36),
  `Winner_Bid` FLOAT,
  `Seller` VARCHAR(50),
  `Bid_Address` VARCHAR(24),
  `Expire_Date` DATETIME,
  FOREIGN KEY (`Winner`) REFERENCES `Users`(`UserUUID`)
);
CREATE TRIGGER IF NOT EXISTS move_expired_items_to_expired_items_table
AFTER DELETE ON `Items`
FOR EACH ROW
BEGIN
    INSERT INTO `Expired-Items` (
        `ItemID`, `Categories`, `Image_URL`, `Item_Name`, `Item_Description`, `Winner`,
        `Winner_Bid`, `Seller`, `Bid_Address`, `Expire_Date`
    ) VALUES (
        OLD.`ItemID`, OLD.`Categories`, OLD.`Image_URL`, OLD.`Item_Name`, OLD.`Item_Description`, 
        OLD.`Highest_Bidder`, OLD.`Current_Bid`, OLD.`Seller`, OLD.`Bid_Address`, 
        OLD.`Expire_Date`
    );
END;
CREATE EVENT IF NOT EXISTS remove_expired_items
ON SCHEDULE EVERY 1 MINUTE
STARTS NOW()
DO
  DELETE FROM items
  WHERE `Expire_Date` <= NOW();