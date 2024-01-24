/*
  Warnings:

  - You are about to drop the column `refreshedToken` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `refreshedToken`,
    ADD COLUMN `refreshToken` VARCHAR(191) NULL;
