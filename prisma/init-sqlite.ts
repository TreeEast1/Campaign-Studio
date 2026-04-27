import fs from "node:fs";
import path from "node:path";
import initSqlJs from "sql.js";

const dbPath = path.join(process.cwd(), "prisma", "dev.db");

async function main() {
  const SQL = await initSqlJs();
  const db = new SQL.Database();

  db.run(`
    CREATE TABLE IF NOT EXISTS "Campaign" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "productName" TEXT NOT NULL,
      "productType" TEXT,
      "targetAudience" TEXT,
      "painPoints" TEXT,
      "sellingPoints" TEXT,
      "priceInfo" TEXT,
      "scheduleInfo" TEXT,
      "processInfo" TEXT,
      "cta" TEXT,
      "notes" TEXT,
      "stylePreference" TEXT,
      "materials" TEXT NOT NULL,
      "briefJson" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "BrandProfile" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "brandName" TEXT NOT NULL,
      "primaryColor" TEXT NOT NULL,
      "secondaryColor" TEXT,
      "styleKeywords" TEXT NOT NULL,
      "toneKeywords" TEXT NOT NULL,
      "layoutHabits" TEXT NOT NULL,
      "bannedClaims" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "ImageApiConfig" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "provider" TEXT NOT NULL,
      "apiKey" TEXT,
      "baseUrl" TEXT,
      "model" TEXT,
      "defaultSize" TEXT,
      "isActive" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "PromptPackage" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "campaignId" TEXT NOT NULL,
      "materialType" TEXT NOT NULL,
      "materialName" TEXT NOT NULL,
      "size" TEXT NOT NULL,
      "visualPrompt" TEXT NOT NULL,
      "copyPrompt" TEXT NOT NULL,
      "negativePrompt" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      CONSTRAINT "PromptPackage_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    );

    CREATE TABLE IF NOT EXISTS "GeneratedAsset" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "campaignId" TEXT NOT NULL,
      "promptPackageId" TEXT,
      "materialType" TEXT NOT NULL,
      "materialName" TEXT NOT NULL,
      "size" TEXT NOT NULL,
      "imageUrl" TEXT,
      "status" TEXT NOT NULL,
      "provider" TEXT,
      "model" TEXT,
      "errorMessage" TEXT,
      "qualityReport" TEXT,
      "isFinal" BOOLEAN NOT NULL DEFAULT false,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "GeneratedAsset_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT "GeneratedAsset_promptPackageId_fkey" FOREIGN KEY ("promptPackageId") REFERENCES "PromptPackage" ("id") ON DELETE SET NULL ON UPDATE CASCADE
    );
  `);

  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  fs.writeFileSync(dbPath, Buffer.from(db.export()));
  db.close();
  console.log(`SQLite database initialized at ${dbPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
