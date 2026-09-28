ALTER TABLE "Project" ADD COLUMN "roomId" TEXT;

UPDATE "Project"
SET "roomId" = COALESCE(
  NULLIF(trim(both '-' from regexp_replace(lower("name"), '[^a-z0-9]+', '-', 'g')), ''),
  'project'
) || '-' || "id";

ALTER TABLE "Project" ALTER COLUMN "roomId" SET NOT NULL;

CREATE UNIQUE INDEX "Project_roomId_key" ON "Project"("roomId");
