-- AlterTable
ALTER TABLE "projectRelations" ALTER COLUMN "organizationId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "profile_images" TEXT;
