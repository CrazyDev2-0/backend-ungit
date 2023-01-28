-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "mobileno" TEXT NOT NULL,
    "emailid" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TrackerRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "repositoryName" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "labels" TEXT NOT NULL,
    "userId" INTEGER,
    CONSTRAINT "TrackerRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
