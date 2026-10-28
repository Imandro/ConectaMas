-- Additive only: old rows remain valid and use createdAt as their logical-day fallback.
ALTER TABLE "DailyCheckin" ADD COLUMN IF NOT EXISTS "dayKey" TEXT;

CREATE INDEX IF NOT EXISTS "DailyCheckin_userId_dayKey_idx"
ON "DailyCheckin"("userId", "dayKey");
