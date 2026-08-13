-- Add reusable application defaults to user profiles.
ALTER TABLE "users"
ADD COLUMN "defaultGpa" DECIMAL(3, 2),
ADD COLUMN "defaultAwards" TEXT,
ADD COLUMN "defaultPublications" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "defaultPublicationLinks" TEXT;

-- Add publication links and community comments to applications.
ALTER TABLE "applications"
ADD COLUMN "publicationLinks" TEXT,
ADD COLUMN "comments" TEXT;
