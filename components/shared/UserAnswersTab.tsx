import React from 'react';
import { getAllUserAnswers } from '@/lib/actions/user.action';
import AnswerCard from '../cards/AnswerCard';
import { SearchParamsProps } from '@/types';
import Pagination from './Pagination';

interface UserAnswersTabProps extends SearchParamsProps {
  userId: string;
  clerkId?: string;
}

const UserAnswersTab = async ({
  userId,
  clerkId,
  searchParams,
}: UserAnswersTabProps) => {
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams.page ? +resolvedSearchParams.page : 1;

  const result = await getAllUserAnswers({ userId, page });

  return (
    <>
      {result.answers?.map((answer) => (
        <AnswerCard
          key={answer.id}
          clerkId={clerkId}
          id={answer.id}
          title={answer.question.title}
          question={answer.question}
          author={answer.author}
          voteCount={answer.upvotes.length}
          createdAt={answer.createdAt}
        />
      ))}
      <div className='mt-10'>
        <Pagination
          pageNumber={
            resolvedSearchParams?.page ? +resolvedSearchParams.page : 1
          }
          isNext={result.isNext}
        />
      </div>
    </>
  );
};

export default UserAnswersTab;
