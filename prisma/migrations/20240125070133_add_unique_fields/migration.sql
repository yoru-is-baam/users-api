/*
  Warnings:

  - You are about to drop the `permission` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `actions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `entities` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `roles` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `permission` DROP FOREIGN KEY `Permission_action_id_fkey`;

-- DropForeignKey
ALTER TABLE `permission` DROP FOREIGN KEY `Permission_entity_id_fkey`;

-- DropForeignKey
ALTER TABLE `permission` DROP FOREIGN KEY `Permission_role_id_fkey`;

-- DropTable
DROP TABLE `permission`;

-- CreateTable
CREATE TABLE `permissions` (
    `role_id` INTEGER NOT NULL,
    `entity_id` INTEGER NOT NULL,
    `action_id` INTEGER NOT NULL,
    `allowed` BOOLEAN NOT NULL,

    PRIMARY KEY (`role_id`, `entity_id`, `action_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `actions_name_key` ON `actions`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `entities_name_key` ON `entities`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `roles_name_key` ON `roles`(`name`);

-- AddForeignKey
ALTER TABLE `permissions` ADD CONSTRAINT `permissions_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `permissions` ADD CONSTRAINT `permissions_entity_id_fkey` FOREIGN KEY (`entity_id`) REFERENCES `entities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `permissions` ADD CONSTRAINT `permissions_action_id_fkey` FOREIGN KEY (`action_id`) REFERENCES `actions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
