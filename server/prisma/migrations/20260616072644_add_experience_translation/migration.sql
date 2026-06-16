-- CreateTable
CREATE TABLE "ExperienceTranslation" (
    "id" TEXT NOT NULL,
    "experienceId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "role" TEXT NOT NULL,
    "description" TEXT,
    "highlights" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExperienceTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExperienceTranslation_locale_idx" ON "ExperienceTranslation"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "ExperienceTranslation_experienceId_locale_key" ON "ExperienceTranslation"("experienceId", "locale");

-- AddForeignKey
ALTER TABLE "ExperienceTranslation" ADD CONSTRAINT "ExperienceTranslation_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;
