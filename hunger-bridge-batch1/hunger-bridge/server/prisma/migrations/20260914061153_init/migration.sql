-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `role` ENUM('DONOR', 'NGO', 'ADMIN') NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `donor_profiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `organizationName` VARCHAR(191) NOT NULL,
    `donorType` ENUM('RESTAURANT', 'HOTEL', 'CATERER', 'EVENT_ORGANIZER', 'INDIVIDUAL', 'OTHER') NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `pincode` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `donor_profiles_userId_key`(`userId`),
    INDEX `donor_profiles_city_idx`(`city`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ngo_profiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `organizationName` VARCHAR(191) NOT NULL,
    `registrationNumber` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `pincode` VARCHAR(191) NOT NULL,
    `verificationStatus` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `verificationNote` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ngo_profiles_userId_key`(`userId`),
    UNIQUE INDEX `ngo_profiles_registrationNumber_key`(`registrationNumber`),
    INDEX `ngo_profiles_city_idx`(`city`),
    INDEX `ngo_profiles_verificationStatus_idx`(`verificationStatus`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `donations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `donorId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `foodCategory` ENUM('VEG', 'NON_VEG', 'VEGAN', 'MIXED') NOT NULL,
    `foodType` ENUM('COOKED_MEAL', 'RAW_INGREDIENTS', 'PACKAGED_FOOD', 'BAKERY', 'FRUITS_VEGETABLES', 'DAIRY', 'BEVERAGES', 'OTHER') NOT NULL,
    `quantity` DOUBLE NOT NULL,
    `quantityUnit` ENUM('KG', 'LITERS', 'PLATES', 'PACKETS', 'PIECES') NOT NULL,
    `servesApprox` INTEGER NULL,
    `preparedAt` DATETIME(3) NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `pickupAddress` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `pincode` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `status` ENUM('AVAILABLE', 'REQUESTED', 'ACCEPTED', 'COLLECTED', 'DISTRIBUTED', 'COMPLETED', 'CANCELLED', 'EXPIRED') NOT NULL DEFAULT 'AVAILABLE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `donations_city_idx`(`city`),
    INDEX `donations_status_idx`(`status`),
    INDEX `donations_foodCategory_idx`(`foodCategory`),
    INDEX `donations_foodType_idx`(`foodType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `donation_requests` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `donationId` INTEGER NOT NULL,
    `ngoId` INTEGER NOT NULL,
    `message` TEXT NULL,
    `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `donation_requests_status_idx`(`status`),
    UNIQUE INDEX `donation_requests_donationId_ngoId_key`(`donationId`, `ngoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `type` ENUM('DONATION_REQUESTED', 'REQUEST_ACCEPTED', 'REQUEST_REJECTED', 'DONATION_CANCELLED', 'DONATION_COLLECTED', 'DONATION_DISTRIBUTED', 'DONATION_COMPLETED', 'NGO_APPROVED', 'NGO_REJECTED', 'GENERAL') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `relatedDonationId` INTEGER NULL,
    `relatedRequestId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `notifications_userId_isRead_idx`(`userId`, `isRead`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `donation_status_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `donationId` INTEGER NOT NULL,
    `status` ENUM('AVAILABLE', 'REQUESTED', 'ACCEPTED', 'COLLECTED', 'DISTRIBUTED', 'COMPLETED', 'CANCELLED', 'EXPIRED') NOT NULL,
    `changedByUserId` INTEGER NOT NULL,
    `note` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `donor_profiles` ADD CONSTRAINT `donor_profiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ngo_profiles` ADD CONSTRAINT `ngo_profiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `donations` ADD CONSTRAINT `donations_donorId_fkey` FOREIGN KEY (`donorId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `donation_requests` ADD CONSTRAINT `donation_requests_donationId_fkey` FOREIGN KEY (`donationId`) REFERENCES `donations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `donation_requests` ADD CONSTRAINT `donation_requests_ngoId_fkey` FOREIGN KEY (`ngoId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `donation_status_history` ADD CONSTRAINT `donation_status_history_donationId_fkey` FOREIGN KEY (`donationId`) REFERENCES `donations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `donation_status_history` ADD CONSTRAINT `donation_status_history_changedByUserId_fkey` FOREIGN KEY (`changedByUserId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
