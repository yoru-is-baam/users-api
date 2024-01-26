/*
  Warnings:

  - You are about to drop the `usertorole` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `usertorole` DROP FOREIGN KEY `UserToRole_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `usertorole` DROP FOREIGN KEY `UserToRole_userId_fkey`;

-- DropTable
DROP TABLE `usertorole`;

-- CreateTable
CREATE TABLE `user_to_roles` (
    `userId` INTEGER NOT NULL,
    `roleId` INTEGER NOT NULL,

    PRIMARY KEY (`userId`, `roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_to_roles` ADD CONSTRAINT `user_to_roles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_to_roles` ADD CONSTRAINT `user_to_roles_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
