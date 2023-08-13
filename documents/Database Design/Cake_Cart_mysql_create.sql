CREATE TABLE `user_master_details` (
	`user_id` int NOT NULL AUTO_INCREMENT,
	`user_fname` varchar(255) NOT NULL,
	`user_lname` varchar(255),
	`user_email` varchar(255) NOT NULL,
	`user_password` varchar(255) NOT NULL,
	`user_image` longblob(255),
	`user_role` longblob(255) NOT NULL DEFAULT '0',
	`created_at` DATETIME(255) NOT NULL,
	`update_at` DATETIME(255) NOT NULL,
	PRIMARY KEY (`user_id`)
);

CREATE TABLE `product_master_details` (
	`product_id` int NOT NULL AUTO_INCREMENT,
	`product_image` longblob NOT NULL,
	`product_title` varchar(255) NOT NULL,
	`product_desc` varchar(255) NOT NULL,
	`product_rating_id` int(255) NOT NULL,
	`product_old_price` int(255) NOT NULL,
	`product_new_less_price` int(255) NOT NULL,
	`product_rating_count` int NOT NULL,
	`product_review_count` int NOT NULL,
	`created_at` DATETIME(255) NOT NULL,
	`updated_at` DATETIME(255) NOT NULL,
	PRIMARY KEY (`product_id`)
);

CREATE TABLE `rating_review_details` (
	`review_rating_id` int NOT NULL AUTO_INCREMENT,
	`user_id` int NOT NULL,
	`review_rating_marks` int NOT NULL,
	`review_rating_comments` longtext(255) NOT NULL,
	`created_at` DATETIME(255) NOT NULL,
	`updated_at` DATETIME(255) NOT NULL,
	PRIMARY KEY (`review_rating_id`)
);

CREATE TABLE `cart_details` (
	`cart_id` int NOT NULL AUTO_INCREMENT,
	`user_id` int NOT NULL,
	`product_id` int NOT NULL,
	PRIMARY KEY (`cart_id`)
);

CREATE TABLE `order_details` (
	`order_id` int NOT NULL AUTO_INCREMENT,
	`user_id` int NOT NULL,
	`created_at` DATETIME NOT NULL,
	`updated_at` DATETIME NOT NULL,
	PRIMARY KEY (`order_id`)
);

CREATE TABLE `deal_of_day_details` (
	`deal_id` int NOT NULL AUTO_INCREMENT,
	`product_id` int NOT NULL,
	PRIMARY KEY (`deal_id`)
);

ALTER TABLE `product_master_details` ADD CONSTRAINT `product_master_details_fk0` FOREIGN KEY (`product_rating_id`) REFERENCES `rating_review_details`(`review_rating_id`);

ALTER TABLE `rating_review_details` ADD CONSTRAINT `rating_review_details_fk0` FOREIGN KEY (`user_id`) REFERENCES `user_master_details`(`user_id`);

ALTER TABLE `cart_details` ADD CONSTRAINT `cart_details_fk0` FOREIGN KEY (`user_id`) REFERENCES `user_master_details`(`user_id`);

ALTER TABLE `cart_details` ADD CONSTRAINT `cart_details_fk1` FOREIGN KEY (`product_id`) REFERENCES `product_master_details`(`product_id`);

ALTER TABLE `order_details` ADD CONSTRAINT `order_details_fk0` FOREIGN KEY (`user_id`) REFERENCES `user_master_details`(`user_id`);

ALTER TABLE `deal_of_day_details` ADD CONSTRAINT `deal_of_day_details_fk0` FOREIGN KEY (`product_id`) REFERENCES `product_master_details`(`product_id`);







