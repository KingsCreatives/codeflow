import React from 'react'
import { getAllUserAnswers } from '@/lib/actions/user.action'
import { SearchParams } from '@/lib/shared.types';
import AnswerCard from '../cards/AnswerCard';

interface UserAnswersTabProps{
  userId: string;
  clerkId?: string;
  searchParams?: SearchParams
}

const UserAnswersTab = async ({userId, clerkId, searchParams} :UserAnswersTabProps ) => {
  const result = await getAllUserAnswers({userId})
  console.log(result)
  return (
    <>
      {result.answers?.map((answer) => (
        <AnswerCard
          key={answer.id}
          title={answer.question.title}
          author={answer.author}
          id={answer.id}
          upvotes={Number(answer.upvotes)}
          createdAt={answer.createdAt}
        />
      ))}
    </>
  );
}

export default UserAnswersTab