-- CreateEnum
CREATE TYPE "TypeTaux" AS ENUM ('ANNUEL', 'MENSUEL');

-- CreateEnum
CREATE TYPE "StatutSimulation" AS ENUM ('DRAFT', 'VALIDATED', 'DELETED');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('PDF', 'EXCEL');

-- CreateTable
CREATE TABLE "Operateur" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Operateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT,
    "telephone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SimulationSession" (
    "id" TEXT NOT NULL,
    "taux" DOUBLE PRECISION NOT NULL,
    "typeTaux" "TypeTaux" NOT NULL,
    "dateTraitement" TIMESTAMP(3) NOT NULL,
    "operateurId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SimulationSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SimulationResult" (
    "id" TEXT NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "duree" INTEGER NOT NULL,
    "mensualite" DOUBLE PRECISION NOT NULL,
    "totalInterets" DOUBLE PRECISION NOT NULL,
    "totalAssurance" DOUBLE PRECISION,
    "statut" "StatutSimulation" NOT NULL DEFAULT 'DRAFT',
    "clientId" TEXT NOT NULL,
    "simulationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SimulationResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SimulationDocument" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "fichier" BYTEA NOT NULL,
    "resultId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SimulationDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Operateur_email_key" ON "Operateur"("email");

-- AddForeignKey
ALTER TABLE "SimulationSession" ADD CONSTRAINT "SimulationSession_operateurId_fkey" FOREIGN KEY ("operateurId") REFERENCES "Operateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulationResult" ADD CONSTRAINT "SimulationResult_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulationResult" ADD CONSTRAINT "SimulationResult_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "SimulationSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulationDocument" ADD CONSTRAINT "SimulationDocument_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "SimulationResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
