CREATE TYPE "SubscriptionStatus" AS ENUM (
  'TRIALING',
  'ACTIVE',
  'EXPIRED',
  'SUSPENDED'
);

CREATE TABLE "Owner" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Owner_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Company" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "sector" TEXT,
  "ownerId" TEXT NOT NULL,
  "trialStartedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "trialEndsAt" TIMESTAMP(3) NOT NULL,
  "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'TRIALING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Owner_email_key" ON "Owner"("email");

CREATE INDEX "Company_ownerId_idx" ON "Company"("ownerId");

CREATE INDEX "Company_subscriptionStatus_trialEndsAt_idx"
ON "Company"("subscriptionStatus", "trialEndsAt");

ALTER TABLE "Company"
ADD CONSTRAINT "Company_ownerId_fkey"
FOREIGN KEY ("ownerId") REFERENCES "Owner"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
