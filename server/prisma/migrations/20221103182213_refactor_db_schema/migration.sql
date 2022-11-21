/*
  Warnings:

  - You are about to drop the column `firstTeamCountryGoals` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `secondTeamCountryGoals` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `firstTeamScore` on the `Guess` table. All the data in the column will be lost.
  - You are about to drop the column `secondTeamScore` on the `Guess` table. All the data in the column will be lost.
  - Added the required column `firstTeamCountryCode` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondTeamCountryCode` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstTeamGoals` to the `Guess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondTeamScoreGoals` to the `Guess` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "firstTeamCountryCode" TEXT NOT NULL,
    "secondTeamCountryCode" TEXT NOT NULL
);
INSERT INTO "new_Game" ("date", "id") SELECT "date", "id" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
CREATE TABLE "new_Guess" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstTeamGoals" INTEGER NOT NULL,
    "secondTeamScoreGoals" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gameId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    CONSTRAINT "Guess_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Guess_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Guess" ("createdAt", "gameId", "id", "participantId") SELECT "createdAt", "gameId", "id", "participantId" FROM "Guess";
DROP TABLE "Guess";
ALTER TABLE "new_Guess" RENAME TO "Guess";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
