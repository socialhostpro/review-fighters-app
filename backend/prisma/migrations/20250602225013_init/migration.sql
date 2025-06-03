-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `affiliateId` VARCHAR(191) NULL,
    `staffId` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_affiliateId_key`(`affiliateId`),
    UNIQUE INDEX `User_staffId_key`(`staffId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserProfile` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `zipCode` VARCHAR(191) NOT NULL,
    `businessName` VARCHAR(191) NULL,
    `businessAddress` VARCHAR(191) NULL,
    `businessPhoneNumber` VARCHAR(191) NULL,
    `businessEmail` VARCHAR(191) NULL,
    `businessWebsite` VARCHAR(191) NULL,
    `businessSocials` JSON NULL,
    `adminNotes` VARCHAR(191) NULL,
    `customerNotes` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `UserProfile_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Review` (
    `id` VARCHAR(191) NOT NULL,
    `reviewerName` VARCHAR(191) NOT NULL,
    `reviewContent` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL,
    `reviewDate` DATETIME(3) NOT NULL,
    `reviewSource` VARCHAR(191) NOT NULL,
    `reviewRelationship` VARCHAR(191) NULL,
    `isCustomer` BOOLEAN NOT NULL,
    `isFormerEmployee` BOOLEAN NULL,
    `knowsReviewerIdentity` BOOLEAN NOT NULL,
    `reviewerDetails` JSON NULL,
    `associatedMediaIds` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Affiliate` (
    `affiliateID` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `signupDate` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `payoutDetails` VARCHAR(191) NOT NULL,
    `currentBalance` DOUBLE NOT NULL,
    `totalClicks` INTEGER NOT NULL,
    `totalSales` INTEGER NOT NULL,
    `affiliateLink` VARCHAR(191) NOT NULL,
    `qrCodeLink` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `isHighValue` BOOLEAN NULL,

    UNIQUE INDEX `Affiliate_userId_key`(`userId`),
    PRIMARY KEY (`affiliateID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StaffMember` (
    `staffId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `internalRole` VARCHAR(191) NOT NULL,
    `team` VARCHAR(191) NULL,
    `isOwner` BOOLEAN NULL,

    UNIQUE INDEX `StaffMember_userId_key`(`userId`),
    PRIMARY KEY (`staffId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserProfile` ADD CONSTRAINT `UserProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Affiliate` ADD CONSTRAINT `Affiliate_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StaffMember` ADD CONSTRAINT `StaffMember_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
