CREATE TABLE `donors` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`first_name` varchar(256) NOT NULL,
	`last_name` varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`task_name` varchar(256) NOT NULL,
	`description` varchar(256),
	`is_completed` boolean DEFAULT false
);
