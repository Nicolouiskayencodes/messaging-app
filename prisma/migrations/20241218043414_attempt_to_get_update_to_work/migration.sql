-- AlterTable
ALTER TABLE "Conversation" ALTER COLUMN "updateAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "updateAt" DROP DEFAULT;