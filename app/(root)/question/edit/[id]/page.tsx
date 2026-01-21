import React from 'react';
import { auth } from '@clerk/nextjs/server';
import Question from '@/components/forms/Question';
import { getUserById } from '@/lib/actions/user.action';
import { getQuestionById } from '@/lib/actions/question.action';
import { ParamsProps } from '@/types';

const page = async ({ params }: ParamsProps) => {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) return null;

  const user = await getUserById({ userId });

  const result = await getQuestionById({ questionId: id });

  // console.log(result)

  return (
    <>
      <h1 className='h1-bold text-dark100_light900'>Edit Question</h1>
      <div className='mt-9'>
        <Question
          type='Edit'
          userId={user?.id!}
          questionDetails={JSON.stringify(result)}
        />
      </div>
    </>
  );
};

export default page;
