-- DropForeignKey
ALTER TABLE "_Read" DROP CONSTRAINT "_Read_A_fkey";

-- AddForeignKey
ALTER TABLE "_Read" ADD CONSTRAINT "_Read_A_fkey" FOREIGN KEY ("A") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
