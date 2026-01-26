import { AnswerFilters } from '@/constants/filters';
import React from 'react';
import Filter from './Filter';
import { getAllAnswers } from '@/lib/actions/answer.action';
import Link from 'next/link';
import Image from 'next/image';
import { getTimeStamp } from '@/lib/utils';
import ParsedContent from './ParsedContent';
import Votes from './Votes';
import Pagination from './Pagination';

interface AllAnswersProps {
  questionId: string;
  userId: string;
  totalAnswers: number;
  page?: number;
  filter?: string;
}

const AllAnswers = async ({
  questionId,
  userId,
  totalAnswers,
  page,
  filter,
}: AllAnswersProps) => {
  const result = await getAllAnswers({
    questionId,
    page: page ? +page : 1,
    sortBy: filter,
  });

  return (
    <div className='mt-11'>
      <div className='flex items-center justify-between'>
        <h3 className='primary-text-gradient'>{totalAnswers} Answers </h3>

        <Filter filters={AnswerFilters} />
      </div>

      <div>
        {result?.answers?.map((answer) => (
          <article key={answer.id} className='light-border border-b py-10'>
            <div className='flex items-center justify-between'>
              <div className='mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
                <Link
                  href={`/profile/${answer.author.id}`}
                  className='flex flex-1 items-start gap-1 sm:items-center'
                >
                  <Image
                    src={answer.author.picture}
                    width={18}
                    height={18}
                    alt='profile'
                    className='rounded-full object-cover max-sm:mt-0.5 '
                  />
                  <div className='flex flex-col sm:flex-row sm:items-center'>
                    <p className='body-semibold text-light300_light700'>
                      {answer.author.name}
                    </p>

                    <p className='small-regular text-light400_light500 mt-0.5 line-clamp-1 ml-1'>
                      answered {getTimeStamp(answer.createdAt)}
                    </p>
                  </div>
                </Link>
                <div className='flex justify-end'>
                  <Votes
                    type='Answer'
                    itemId={answer?.id ?? ''}
                    userId={answer.authorId ?? ''}
                    upvotes={answer.upvotes?.length ?? 0}
                    downvotes={answer?.downvotes?.length ?? 0}
                    hasupVoted={
                      answer?.upvotes?.some((u) => u.id === answer.authorId) ??
                      false
                    }
                    hasdownVoted={
                      answer?.downvotes?.some(
                        (u) => u.id === answer.authorId,
                      ) ?? false
                    }
                  />
                </div>
              </div>
            </div>
            <ParsedContent data={answer.content} />
          </article>
        ))}
      </div>
      <div className='mt-10'>
        <Pagination
          pageNumber={
           page ? +page : 1
          }
          isNext={result.isNext}
        />
      </div>
    </div>
  );
};

export default AllAnswers;
