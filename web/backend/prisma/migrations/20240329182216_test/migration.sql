-- CreateTable
CREATE TABLE `attendee` (
    `attendee_id` INTEGER NOT NULL AUTO_INCREMENT,
    `session_id` INTEGER NULL,
    `user_id` INTEGER NULL,

    INDEX `session_id`(`session_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`attendee_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `developer` (
    `developer_id` INTEGER NOT NULL AUTO_INCREMENT,
    `velocity_per_sprint` INTEGER NULL,
    `availability_hours` INTEGER NULL,
    `interrupt_hours` INTEGER NULL,
    `estimates_id` INTEGER NULL,

    INDEX `estimates_id`(`estimates_id`),
    PRIMARY KEY (`developer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `duration` (
    `duration_id` INTEGER NOT NULL AUTO_INCREMENT,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `start_time` TIME(0) NULL,
    `end_time` TIME(0) NULL,

    PRIMARY KEY (`duration_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estimates` (
    `estimates_id` INTEGER NOT NULL AUTO_INCREMENT,
    `story_points` INTEGER NULL,
    `product_backlog_id` INTEGER NULL,

    PRIMARY KEY (`estimates_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `poker_planning` (
    `poker_planning_id` INTEGER NOT NULL AUTO_INCREMENT,
    `session_id` INTEGER NULL,
    `project_id` INTEGER NULL,
    `estimates_id` INTEGER NULL,
    `product_backlog_id` INTEGER NULL,

    INDEX `estimates_id`(`estimates_id`),
    INDEX `product_backlog_id`(`product_backlog_id`),
    INDEX `project_id`(`project_id`),
    INDEX `session_id`(`session_id`),
    PRIMARY KEY (`poker_planning_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_backlog` (
    `product_backlog_id` INTEGER NOT NULL AUTO_INCREMENT,
    `project_id` INTEGER NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `priority` VARCHAR(255) NULL,
    `assignee` INTEGER NULL,
    `reporter` INTEGER NULL,
    `task_id` INTEGER NULL,
    `estimates_id` INTEGER NULL,
    `sprint_backlog_id` INTEGER NULL,

    INDEX `assignee`(`assignee`),
    INDEX `estimates_id`(`estimates_id`),
    INDEX `project_id`(`project_id`),
    INDEX `reporter`(`reporter`),
    INDEX `task_id`(`task_id`),
    PRIMARY KEY (`product_backlog_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_owner` (
    `product_owner_id` INTEGER NOT NULL AUTO_INCREMENT,
    `project_id` INTEGER NULL,

    INDEX `project_id`(`project_id`),
    PRIMARY KEY (`product_owner_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project` (
    `project_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `product_backlog_id` INTEGER NULL,
    `sprint_id` INTEGER NULL,
    `product_owner_id` INTEGER NULL,
    `poker_planning_id` INTEGER NULL,
    `project_team_id` INTEGER NULL,

    INDEX `poker_planning_id`(`poker_planning_id`),
    INDEX `product_backlog_id`(`product_backlog_id`),
    INDEX `product_owner_id`(`product_owner_id`),
    INDEX `project_team_id`(`project_team_id`),
    INDEX `sprint_id`(`sprint_id`),
    PRIMARY KEY (`project_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_team` (
    `project_team_id` INTEGER NOT NULL AUTO_INCREMENT,
    `developer_id` INTEGER NULL,
    `scrum_master_id` INTEGER NULL,
    `product_owner_id` INTEGER NULL,
    `project_id` INTEGER NULL,

    INDEX `developer_id`(`developer_id`),
    INDEX `product_owner_id`(`product_owner_id`),
    INDEX `project_id`(`project_id`),
    INDEX `scrum_master_id`(`scrum_master_id`),
    PRIMARY KEY (`project_team_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scrum_master` (
    `scrum_master_id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`scrum_master_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session` (
    `session_id` INTEGER NOT NULL AUTO_INCREMENT,
    `duration_id` INTEGER NULL,
    `attendee_id` INTEGER NULL,
    `invite_code` VARCHAR(255) NULL,

    INDEX `attendee_id`(`attendee_id`),
    INDEX `duration_id`(`duration_id`),
    PRIMARY KEY (`session_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sprint` (
    `sprint_id` INTEGER NOT NULL AUTO_INCREMENT,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `sprint_backlog_id` INTEGER NULL,

    INDEX `sprint_backlog_id`(`sprint_backlog_id`),
    PRIMARY KEY (`sprint_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sprint_backlog` (
    `sprint_backlogs_id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_backlogs_id` INTEGER NULL,
    `sprint_id` INTEGER NULL,

    INDEX `product_backlogs_id`(`product_backlogs_id`),
    INDEX `sprint_id`(`sprint_id`),
    PRIMARY KEY (`sprint_backlogs_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `task` (
    `task_id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(255) NULL,
    `status` VARCHAR(255) NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `product_backlog_id` INTEGER NOT NULL,

    PRIMARY KEY (`task_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification` (
    `notification_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `message` VARCHAR(255) NULL,

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`notification_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invitation` (
    `invitation_id` INTEGER NOT NULL AUTO_INCREMENT,
    `project_id` INTEGER NULL,
    `developer_id` INTEGER NULL,
    `product_owner_id` INTEGER NULL,
    `notification_id` INTEGER NULL,
    `status` VARCHAR(255) NULL,

    PRIMARY KEY (`invitation_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `attendee` ADD CONSTRAINT `attendee_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `session`(`session_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `attendee` ADD CONSTRAINT `attendee_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `developer` ADD CONSTRAINT `developer_ibfk_1` FOREIGN KEY (`developer_id`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `developer` ADD CONSTRAINT `developer_ibfk_2` FOREIGN KEY (`estimates_id`) REFERENCES `estimates`(`estimates_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `poker_planning` ADD CONSTRAINT `poker_planning_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `session`(`session_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `poker_planning` ADD CONSTRAINT `poker_planning_ibfk_3` FOREIGN KEY (`estimates_id`) REFERENCES `estimates`(`estimates_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `poker_planning` ADD CONSTRAINT `poker_planning_ibfk_4` FOREIGN KEY (`product_backlog_id`) REFERENCES `product_backlog`(`product_backlog_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `product_owner` ADD CONSTRAINT `product_owner_ibfk_1` FOREIGN KEY (`product_owner_id`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `project` ADD CONSTRAINT `project_ibfk_2` FOREIGN KEY (`sprint_id`) REFERENCES `sprint`(`sprint_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `project_team` ADD CONSTRAINT `project_team_ibfk_1` FOREIGN KEY (`developer_id`) REFERENCES `developer`(`developer_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `project_team` ADD CONSTRAINT `project_team_ibfk_2` FOREIGN KEY (`scrum_master_id`) REFERENCES `scrum_master`(`scrum_master_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `project_team` ADD CONSTRAINT `project_team_ibfk_3` FOREIGN KEY (`product_owner_id`) REFERENCES `product_owner`(`product_owner_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `project_team` ADD CONSTRAINT `project_team_ibfk_4` FOREIGN KEY (`project_id`) REFERENCES `project`(`project_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `session` ADD CONSTRAINT `session_ibfk_1` FOREIGN KEY (`duration_id`) REFERENCES `duration`(`duration_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `session` ADD CONSTRAINT `session_ibfk_2` FOREIGN KEY (`attendee_id`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `invitation` ADD CONSTRAINT `invitation_ibfk_1` FOREIGN KEY (`notification_id`) REFERENCES `notification`(`notification_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
