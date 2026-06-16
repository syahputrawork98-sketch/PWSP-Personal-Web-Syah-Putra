-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('EN', 'ID', 'JA');

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('CLIENT_WORK', 'FREELANCE', 'CASE_STUDY', 'LEARNING_PROJECT', 'INTERNAL');

-- CreateEnum
CREATE TYPE "ProjectWorkStatus" AS ENUM ('COMPLETED', 'IN_PROGRESS', 'MAINTENANCE', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "clientName" TEXT,
ADD COLUMN     "projectStatus" "ProjectWorkStatus",
ADD COLUMN     "projectType" "ProjectType";

-- CreateTable
CREATE TABLE "ProjectTranslation" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT,
    "role" TEXT,
    "projectContext" TEXT,
    "problem" TEXT,
    "solution" TEXT,
    "keyFeatures" TEXT[],
    "responsibilities" TEXT[],
    "outcomes" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectTranslation_locale_idx" ON "ProjectTranslation"("locale");

-- CreateIndex
CREATE INDEX "ProjectTranslation_projectId_idx" ON "ProjectTranslation"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectTranslation_projectId_locale_key" ON "ProjectTranslation"("projectId", "locale");

-- AddForeignKey
ALTER TABLE "ProjectTranslation" ADD CONSTRAINT "ProjectTranslation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
