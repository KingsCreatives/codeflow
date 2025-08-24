import { getQuestionById } from '@/lib/actions/question.action';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import Metric from '@/components/shared/Metric';
import { getTimeStamp } from '@/lib/utils';
import ParsedContent from '@/components/shared/ParsedContent';
import Tag from '@/components/shared/Tag';
import Answer from '@/components/forms/Answer';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db/client';
import AllAnswers from '@/components/shared/AllAnswers';
import Votes from '@/components/shared/Votes';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Record<string, string | string[] | undefined>;
}

const page = async ({ params, searchParams }: PageProps) => {
  const {id} = await params
  const result = await getQuestionById({
    questionId: id,
  });

  const { userId } = await auth();

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId ?? undefined,
    },
    include: {
      savedQuestions: true,
    },
  });

   return (
    <>
      <div>
        <div className='flex-start w-full flex-col'>
          <div className='flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
            <Link
              href={`/profile/${result.question?.author.clerkId}`}
              className='flex items-center justify-start gap-1'
            >
              <Image
                src={
                  result.question?.author.picture || '/assets/images/avatar.png'
                }
                alt='back'
                width={24}
                height={24}
                className='cursor-pointer rounded-full'
              />
              <p className='paragraph-semibold text-dark300_light700'>
                {result.question?.author.name}
              </p>
            </Link>

            <div className='flex justify-end'>
              <Votes
                type='Question'
                itemId={result.question?.id ?? ''}
                userId={user?.id ?? ''}
                upvotes={result.question?.upvotes?.length ?? 0}
                downvotes={result.question?.downvotes?.length ?? 0}
                hasupVoted={
                  result.question?.upvotes?.some((u) => u.id === user?.id) ??
                  false
                }
                hasdownVoted={
                  result.question?.downvotes?.some((u) => u.id === user?.id) ??
                  false
                }
                hasSaved={
                  user?.savedQuestions?.some(
                    (q) => q.id === result.question?.id
                  ) ?? false
                }
              />
            </div>
          </div>

          <h2 className='w-full text-left h2-semibold text-dark200_light900 mt-3.5'>
            {result.question?.title}
          </h2>
        </div>

        <div className='mb-8 mt-5 flex flex-wrap gap-4'>
          <Metric
            imgUrl='/assets/icons/clock.svg'
            alt='clock icon'
            value={`asked ${getTimeStamp(result.question?.createdAt ?? '')}`}
            title='Asked'
            textStyles='small-medium text-dark400_light800'
            isAuthor={false}
          />
          <Metric
            imgUrl='/assets/icons/message.svg'
            alt='answers'
            value={result.question?.answers.length || 0}
            title='Answers'
            textStyles='small-medium text-dark400_light800'
            isAuthor={false}
          />
          <Metric
            imgUrl='/assets/icons/message.svg'
            alt='views'
            value={result.question?.views || 0}
            title='Views'
            textStyles='small-medium text-dark400_light800'
            isAuthor={false}
          />
        </div>

        <ParsedContent data={result.question?.content ?? ''} />

        <div>
          {result.question?.tags && result.question.tags.length > 0 && (
            <div className='mt-8 flex flex-wrap gap-4'>
              {result.question.tags.map((tag) => (
                <Tag
                  key={tag.id}
                  id={tag.id}
                  name={tag.name}
                  showCount={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AllAnswers
        questionId={result.question?.id ?? ''}
        authorId={user?.id ?? ''}
        totalAnswers={result.question?.answers.length || 0}
      />

      <Answer
        authorId={user?.id ?? ''}
        question={result.question?.content ?? ''}
        questionId={result.question?.id ?? ''}
      />
    </>
  );
};

export default page;
