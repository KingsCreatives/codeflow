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
    <div className='mt-5 flex flex-col gap-6'>
      {result.answers?.length > 0 ? (
        result.answers.map((answer) => (
          <AnswerCard
            key={answer.id}
            clerkId={clerkId}
            id={answer.id}
            question={answer.question}
            author={answer.author}
            title={answer.question.title}
            content={answer.content} 
            voteCount={answer.upvotes.length}
            createdAt={answer.createdAt}
          />
        ))
      ) : (
        <div className='paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center'>
          You have not answered any questions yet.
        </div>
      )}

      <div className='mt-10'>
        <Pagination pageNumber={page} isNext={result.isNext} />
      </div>
    </div>
  );
};

export default UserAnswersTab;
