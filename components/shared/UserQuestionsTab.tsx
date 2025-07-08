import React from 'react'
import { getAllUserQuestions } from '@/lib/actions/user.action'
import { formatNumber } from '@/lib/utils'
import QuestionCard from '@/components/cards/QuestionCard'

interface UserQuestionsTabProps {
  userId: string;
  clerkId?: string;
  searchParams?: {
    query?: string | null;
    type?: string | null;
  };
}

const UserQuestionsTab = async({searchParams, userId, clerkId} : UserQuestionsTabProps) => {
    const result = await getAllUserQuestions({ userId})

  return (
    <>
      {result?.questions?.length > 0 &&
        result.questions.map((question) => (
          <QuestionCard
            key={question.id}
            id={question.id}
            clerkId={clerkId}
            title={question.title}
            tags={question.tags.map((tag) => ({
              id: tag.id,
              name: tag.name,
            }))}
            upvotes={formatNumber(0)}
            views={formatNumber(question.views)}
            author={{
              picture: question.author.picture,
              id: question.author.id,
              name: question.author.name,
            }}
            answerCount={question._count.answers}
            createdAt={question.createdAt}
          />
        ))}
    </>
  );
}

export default UserQuestionsTab