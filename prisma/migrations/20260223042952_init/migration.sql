-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT,
    "location" TEXT,
    "description" TEXT,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Bullet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "experienceId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "impactScore" INTEGER NOT NULL DEFAULT 5,
    "relevanceScore" INTEGER NOT NULL DEFAULT 5,
    "metric" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Bullet_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "pitch" TEXT NOT NULL,
    "casestudy" TEXT,
    "githubUrl" TEXT,
    "demoUrl" TEXT,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "techStack" TEXT NOT NULL DEFAULT '[]',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "proficiency" INTEGER NOT NULL DEFAULT 3,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Education" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "school" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "field" TEXT,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT,
    "gpa" TEXT,
    "honors" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "expires" TEXT,
    "credUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Leadership" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "org" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT,
    "bullets" TEXT NOT NULL DEFAULT '[]',
    "tags" TEXT NOT NULL DEFAULT '[]',
    "order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Loadout" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "exportRules" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LoadoutItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "loadoutId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "bulletCapOverride" INTEGER,
    CONSTRAINT "LoadoutItem_loadoutId_fkey" FOREIGN KEY ("loadoutId") REFERENCES "Loadout" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Loadout_slug_key" ON "Loadout"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "LoadoutItem_loadoutId_entityType_entityId_key" ON "LoadoutItem"("loadoutId", "entityType", "entityId");
