-- CreateTable
CREATE TABLE "_AnswerUpvotes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AnswerUpvotes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AnswerDownvotes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AnswerDownvotes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AnswerUpvotes_B_index" ON "_AnswerUpvotes"("B");

-- CreateIndex
CREATE INDEX "_AnswerDownvotes_B_index" ON "_AnswerDownvotes"("B");

-- AddForeignKey
ALTER TABLE "_AnswerUpvotes" ADD CONSTRAINT "_AnswerUpvotes_A_fkey" FOREIGN KEY ("A") REFERENCES "Answer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnswerUpvotes" ADD CONSTRAINT "_AnswerUpvotes_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnswerDownvotes" ADD CONSTRAINT "_AnswerDownvotes_A_fkey" FOREIGN KEY ("A") REFERENCES "Answer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnswerDownvotes" ADD CONSTRAINT "_AnswerDownvotes_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
