-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Loadout" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "templateId" TEXT NOT NULL DEFAULT 'ats-classic',
    "exportRules" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Loadout" ("createdAt", "exportRules", "id", "isDefault", "name", "slug", "updatedAt") SELECT "createdAt", "exportRules", "id", "isDefault", "name", "slug", "updatedAt" FROM "Loadout";
DROP TABLE "Loadout";
ALTER TABLE "new_Loadout" RENAME TO "Loadout";
CREATE UNIQUE INDEX "Loadout_slug_key" ON "Loadout"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
