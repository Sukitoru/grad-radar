ALTER TABLE "decisions"
ADD COLUMN "waitlistUntilTermId" UUID;

CREATE INDEX "decisions_waitlistUntilTermId_idx"
ON "decisions"("waitlistUntilTermId");

ALTER TABLE "decisions"
ADD CONSTRAINT "decisions_waitlistUntilTermId_fkey"
FOREIGN KEY ("waitlistUntilTermId")
REFERENCES "terms"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;
