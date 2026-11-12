DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'UserRole'
      AND typtype = 'e'
  ) THEN
    ALTER TYPE "UserRole" RENAME TO "LegacyUserRole";
  END IF;
END $$;

CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UserRole" (
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("userId", "roleId")
);

CREATE TABLE "RolePermission" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId", "permissionId")
);

CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "details" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");
CREATE UNIQUE INDEX "Permission_resource_action_key" ON "Permission"("resource", "action");
CREATE INDEX "UserRole_roleId_idx" ON "UserRole"("roleId");
CREATE INDEX "RolePermission_permissionId_idx" ON "RolePermission"("permissionId");
CREATE INDEX "AuditLog_userId_createdAt_idx" ON "AuditLog"("userId", "createdAt");
CREATE INDEX "AuditLog_resource_resourceId_idx" ON "AuditLog"("resource", "resourceId");

INSERT INTO "Role" ("id", "name", "description", "isSystem", "updatedAt")
VALUES
  ('role_admin', 'ADMIN', 'Full boutique administration access', true, CURRENT_TIMESTAMP),
  ('role_manager', 'MANAGER', 'Boutique management access', true, CURRENT_TIMESTAMP),
  ('role_cashier', 'CASHIER', 'Point-of-sale access', true, CURRENT_TIMESTAMP),
  ('role_inventory_staff', 'INVENTORY_STAFF', 'Inventory management access', true, CURRENT_TIMESTAMP)
ON CONFLICT ("name") DO NOTHING;

INSERT INTO "UserRole" ("userId", "roleId")
SELECT u."id", r."id"
FROM "User" u
JOIN "Role" r ON r."name" = u."role"::text
ON CONFLICT ("userId", "roleId") DO NOTHING;

ALTER TABLE "User" DROP COLUMN "role";
DROP TYPE IF EXISTS "LegacyUserRole";

ALTER TABLE "UserRole"
  ADD CONSTRAINT "UserRole_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserRole"
  ADD CONSTRAINT "UserRole_roleId_fkey"
  FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "RolePermission"
  ADD CONSTRAINT "RolePermission_roleId_fkey"
  FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "RolePermission"
  ADD CONSTRAINT "RolePermission_permissionId_fkey"
  FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AuditLog"
  ADD CONSTRAINT "AuditLog_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
