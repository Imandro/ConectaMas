-- AlterTable
ALTER TABLE "User" DROP COLUMN IF EXISTS "image";
ALTER TABLE "User" DROP COLUMN IF EXISTS "bannerUrl";

-- AlterTable
ALTER TABLE "Group" DROP COLUMN IF EXISTS "image";

-- AlterTable
ALTER TABLE "Video" DROP COLUMN IF EXISTS "thumbnailUrl";
