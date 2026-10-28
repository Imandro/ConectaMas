CREATE TABLE "BillingPurchaseClaim" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "productCode" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BillingPurchaseClaim_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "BillingPurchaseClaim_userId_expiresAt_idx" ON "BillingPurchaseClaim"("userId", "expiresAt");

ALTER TABLE "BillingPurchaseClaim" ADD CONSTRAINT "BillingPurchaseClaim_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
