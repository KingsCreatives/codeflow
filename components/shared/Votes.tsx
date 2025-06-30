'use client';

import React from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { downvoteQuestion, upvoteQuestion } from '@/lib/actions/question.action';
import { upvoteAnswer, downvoteAnswer } from '@/lib/actions/answer.action';
import { saveQuestion } from '@/lib/actions/user.action';

interface VoteProps {
  type: string;
  itemId: string;
  userId: string;
  upvotes: number;
  downvotes: number;
  hasupVoted: boolean;
  hasdownVoted: boolean;
  hasSaved?: boolean;
}

const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  downvotes,
  hasupVoted,
  hasdownVoted,
  hasSaved,
}: VoteProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const hadleVote = async (action: string) => {
    if (!userId) {
      return;
    }

    if (action === 'upvote') {
      
      if (type === 'Question') {
        await upvoteQuestion({
          questionId: itemId,
          userId,
          hasupVoted,
          hasdownVoted,
          path: pathname,
        });
      }else if (type === "Answer"){
        console.log('upvoting an answer');

        await upvoteAnswer({
          answerId: itemId,
          userId,
          hasupVoted,
          hasdownVoted,
          path: pathname,
        });
      }
      return
    }

    if (action === 'downvote') {
      if (type === 'Question') {
        
        await downvoteQuestion({
          questionId:itemId,
          userId,
          hasupVoted,
          hasdownVoted,
          path: pathname,
        });
      }else if (type === "Answer"){
        console.log('downvoting a answer');
        await downvoteAnswer({
          answerId:itemId,
          userId,
          hasupVoted,
          hasdownVoted,
          path: pathname,
        });
      }
      return
    }

    
  };

  const handleSave = async() => {
       await saveQuestion({
         questionId: itemId,
         userId,
         path: pathname,
       });
  }

  return (
    <div className='flex gap-5'>
      <div className='flex-center gap-2 5'>
        <div className='flex-center gap-1 5'>
          <Image
            src={
              hasupVoted
                ? '/assets/icons/upvoted.svg'
                : '/assets/icons/upvote.svg'
            }
            height={18}
            width={18}
            className='cursor-pointer'
            onClick={() => {
              hadleVote('upvote');
            }}
            alt='upvote'
          />
          <div className='flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1'>
            <p className='subtle-medium text-dark400_light900'>{upvotes}</p>
          </div>
        </div>
        <div className='flex-center gap-1 5'>
          <Image
            src={
              hasdownVoted
                ? '/assets/icons/downvoted.svg'
                : '/assets/icons/downvote.svg'
            }
            height={18}
            width={18}
            className='cursor-pointer'
            onClick={() => {
              hadleVote('downvote');
            }}
            alt='downvote'
          />
          <div className='flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1'>
            <p className='subtle-medium text-dark400_light900'>{downvotes}</p>
          </div>
        </div>
      </div>
      {type === 'Question' && (
        <Image
          src={
            hasSaved
              ? '/assets/icons/star-filled.svg'
              : '/assets/icons/star-red.svg'
          }
          height={18}
          width={18}
          className='cursor-pointer'
          onClick={handleSave}
          alt='saved'
        />
      )}
    </div>
  );
};

export default Votes;
