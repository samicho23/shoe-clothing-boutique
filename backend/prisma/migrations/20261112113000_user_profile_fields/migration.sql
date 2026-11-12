CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED');

ALTER TABLE "User"
  ADD COLUMN "firstName" TEXT,
  ADD COLUMN "lastName" TEXT,
  ADD COLUMN "password" TEXT,
  ADD COLUMN "phoneNumber" TEXT,
  ADD COLUMN "status" "UserStatus" NOT NULL DEFAULT 'PENDING',
  ADD COLUMN "emailVerified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "emailVerifiedAt" TIMESTAMP(3),
  ADD COLUMN "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "phoneVerifiedAt" TIMESTAMP(3);

UPDATE "User"
SET
  "firstName" = split_part("name", ' ', 1),
  "lastName" = CASE
    WHEN position(' ' in "name") > 0 THEN substring("name" from position(' ' in "name") + 1)
    ELSE split_part("name", ' ', 1)
  END,
  "password" = "passwordHash",
  "status" = CASE WHEN "isActive" THEN 'ACTIVE'::"UserStatus" ELSE 'SUSPENDED'::"UserStatus" END,
  "emailVerified" = true;

ALTER TABLE "User"
  ALTER COLUMN "firstName" SET NOT NULL,
  ALTER COLUMN "lastName" SET NOT NULL,
  ALTER COLUMN "password" SET NOT NULL,
  ALTER COLUMN "email" DROP NOT NULL,
  DROP COLUMN "name",
  DROP COLUMN "passwordHash",
  DROP COLUMN "isActive";

CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");
