-- Create AI chat consent fields and private message history.
ALTER TABLE "User"
  ADD COLUMN "aiContextEnabled" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "aiContextConsentAt" TIMESTAMP(3);

CREATE TABLE "AiChatMessage" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "mode" TEXT,
  "content" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AiChatMessage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AiChatMessage_userId_createdAt_idx" ON "AiChatMessage"("userId", "createdAt");
CREATE INDEX "AiChatMessage_userId_role_createdAt_idx" ON "AiChatMessage"("userId", "role", "createdAt");

ALTER TABLE "AiChatMessage"
  ADD CONSTRAINT "AiChatMessage_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
