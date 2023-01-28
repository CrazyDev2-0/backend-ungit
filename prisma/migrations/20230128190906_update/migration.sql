/*
  Warnings:

  - You are about to drop the column `body` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `url` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Notification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "userId" INTEGER,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Notification" ("id", "timestamp", "title", "userId") SELECT "id", "timestamp", "title", "userId" FROM "Notification";
DROP TABLE "Notification";
ALTER TABLE "new_Notification" RENAME TO "Notification";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
