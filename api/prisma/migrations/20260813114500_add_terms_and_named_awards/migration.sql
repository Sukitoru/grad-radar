ALTER TABLE "users"
ALTER COLUMN "defaultAwards" DROP DEFAULT,
ALTER COLUMN "defaultAwards" TYPE TEXT[] USING ARRAY[]::TEXT[],
ALTER COLUMN "defaultAwards" SET DEFAULT ARRAY[]::TEXT[];

ALTER TABLE "applications"
ALTER COLUMN "awards" DROP DEFAULT,
ALTER COLUMN "awards" TYPE TEXT[] USING ARRAY[]::TEXT[],
ALTER COLUMN "awards" SET DEFAULT ARRAY[]::TEXT[];

UPDATE "users"
SET "defaultPublications" = LEAST(GREATEST("defaultPublications", 0), 100);

UPDATE "applications"
SET "publications" = LEAST(GREATEST("publications", 0), 100);

ALTER TABLE "users"
ADD CONSTRAINT "users_defaultAwards_limit"
CHECK (cardinality("defaultAwards") <= 5),
ADD CONSTRAINT "users_defaultPublications_limit"
CHECK ("defaultPublications" BETWEEN 0 AND 100);

ALTER TABLE "applications"
ADD CONSTRAINT "applications_awards_limit"
CHECK (cardinality("awards") <= 5),
ADD CONSTRAINT "applications_publications_limit"
CHECK ("publications" BETWEEN 0 AND 100);

INSERT INTO "terms" (
  "id",
  "name",
  "academicYear",
  "createdAt",
  "updatedAt"
)
SELECT
  gen_random_uuid(),
  semester.name,
  year.value,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM (VALUES ('Spring'), ('Fall')) AS semester(name)
CROSS JOIN generate_series(2026, 2031) AS year(value)
ON CONFLICT ("name", "academicYear") DO NOTHING;
