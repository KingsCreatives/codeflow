import Link from 'next/link';
import React from 'react';
import { auth } from '@clerk/nextjs/server';
import { SignedIn } from '@clerk/nextjs';
import Metric from '../shared/Metric';
import { formatNumber, getTimeStamp } from '@/lib/utils';
import EditDeleteAction from '../shared/EditDeleteAction';

interface AnswerProps {
  id: string;
  title?: string;
  content: string; 
  clerkId?: string;
  author: { id: string; name: string; picture: string; clerkId?: string };
  question: { id: string; title: string };
  voteCount: number;
  createdAt: Date;
}

const AnswerCard = async ({
  clerkId,
  id,
  title,
  content, 
  author,
  question,
  voteCount,
  createdAt,
}: AnswerProps) => {
  const { userId } = await auth();
  const userIsAuthor = clerkId && userId === clerkId;

  const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...';
  };

  return (
    <div className='card-wrapper p-9 sm:px-11 rounded-[10px]'>
      <div className='flex flex-col-reverse items-start justify-between gap-5 sm:flex-row'>
        <div className='flex-1'>
          <span className='subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden'>
            {getTimeStamp(createdAt)}
          </span>

          <Link href={`/question/${question.id}#${id}`}>
            <h3 className='sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1'>
              {question.title}
            </h3>
          </Link>

          <p className='body-regular text-dark400_light700 mt-2 line-clamp-2'>
            {stripHtml(content)}
          </p>
        </div>

        <SignedIn>
          {userIsAuthor && (
            <EditDeleteAction type='Answer' itemId={JSON.stringify(id)} />
          )}
        </SignedIn>
      </div>

      <div className='flex-between mt-6 w-full flex-wrap gap-3'>
        <Metric
          imgUrl={author.picture || '/assets/icons/user.svg'}
          alt='user'
          value={author.name}
          title={` • answered ${getTimeStamp(createdAt)}`}
          textStyles='body-medium text-dark400_light700'
          href={`/profile/${author.clerkId}`}
          isAuthor
        />

        <Metric
          imgUrl='/assets/icons/like.svg'
          alt='Votes'
          value={formatNumber(voteCount)}
          title='Votes'
          textStyles='small-medium text-dark400_light800'
        />
      </div>
    </div>
  );
};

export default AnswerCard;
