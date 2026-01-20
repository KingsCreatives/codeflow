import React from 'react';
import { getAllUserQuestions } from '@/lib/actions/user.action';
import { formatNumber } from '@/lib/utils';
import QuestionCard from '@/components/cards/QuestionCard';
import { SearchParamsProps } from '@/types';

interface UserQuestionsTabProps extends SearchParamsProps {
  userId: string;
  clerkId?: string;
}

const UserQuestionsTab = async ({
  searchParams,
  userId,
  clerkId,
}: UserQuestionsTabProps) => {
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams.page ? +resolvedSearchParams.page : 1;

  const result = await getAllUserQuestions({ userId, page });

  return (
    <>
      {result?.questions?.length > 0 &&
        result.questions.map((question) => (
          <div className='my-3.5'>
            <QuestionCard
              key={question.id}
              id={question.id}
              clerkId={clerkId}
              title={question.title}
              tags={question.tags.map((tag) => ({
                id: tag.id,
                name: tag.name,
              }))}
              voteCount={formatNumber(
                (question.upvotes?.length ?? 0) -
                  (question.downvotes?.length ?? 0),
              )}
              views={formatNumber(question.views)}
              author={{
                picture: question.author.picture,
                id: question.author.id,
                name: question.author.name,
              }}
              answerCount={question._count.answers}
              createdAt={question.createdAt}
            />
          </div>
        ))}
    </>
  );
};

export default UserQuestionsTab;
