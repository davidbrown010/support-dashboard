ALTER TABLE `donors` ADD `street_address` varchar(256);--> statement-breakpoint
ALTER TABLE `donors` ADD `city_address` varchar(256);--> statement-breakpoint
ALTER TABLE `donors` ADD `state_address` varchar(2);--> statement-breakpoint
ALTER TABLE `donors` ADD `zip_address` varchar(10);--> statement-breakpoint
ALTER TABLE `tasks` ADD `task_type` int NOT NULL;