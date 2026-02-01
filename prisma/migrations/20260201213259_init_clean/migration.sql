/*
  Warnings:

  - You are about to drop the column `resultId` on the `SimulationDocument` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SimulationDocument" DROP CONSTRAINT "SimulationDocument_resultId_fkey";

-- AlterTable
ALTER TABLE "SimulationDocument" DROP COLUMN "resultId";
