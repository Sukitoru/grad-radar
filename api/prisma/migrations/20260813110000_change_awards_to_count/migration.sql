ALTER TABLE "users"
ALTER COLUMN "defaultAwards" TYPE INTEGER
USING CASE
  WHEN "defaultAwards" ~ '^[0-9]+$' THEN "defaultAwards"::INTEGER
  ELSE 0
END,
ALTER COLUMN "defaultAwards" SET DEFAULT 0,
ALTER COLUMN "defaultAwards" SET NOT NULL;

ALTER TABLE "applications"
ALTER COLUMN "awards" TYPE INTEGER
USING CASE
  WHEN "awards" ~ '^[0-9]+$' THEN "awards"::INTEGER
  ELSE 0
END,
ALTER COLUMN "awards" SET DEFAULT 0,
ALTER COLUMN "awards" SET NOT NULL;
