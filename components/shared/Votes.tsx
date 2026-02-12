'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  downvoteQuestion,
  upvoteQuestion,
} from '@/lib/actions/question.action';
import { upvoteAnswer, downvoteAnswer } from '@/lib/actions/answer.action';
import { saveQuestion } from '@/lib/actions/user.action';
import { trackQuestionViews } from '@/lib/actions/interaction.action';
import { toast } from 'sonner'; 
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

  const handleVote = async (action: string) => {
    if (!userId) {
      return toast.error('Please log in', {
        description: 'You must be logged in to vote.',
      });
    }

    try {
      if (action === 'upvote') {
        if (type === 'Question') {
          await upvoteQuestion({
            questionId: itemId,
            userId,
            hasupVoted,
            hasdownVoted,
            path: pathname,
          });
        } else if (type === 'Answer') {
          await upvoteAnswer({
            answerId: itemId,
            userId,
            hasupVoted,
            hasdownVoted,
            path: pathname,
          });
        }

        return toast.success(
          `Upvote ${!hasupVoted ? 'Successful' : 'Removed'}`,
          {
            description: !hasupVoted
              ? 'Thanks for supporting this content!'
              : 'Your upvote has been retracted.',
          },
        );
      }

      if (action === 'downvote') {
        if (type === 'Question') {
          await downvoteQuestion({
            questionId: itemId,
            userId,
            hasupVoted,
            hasdownVoted,
            path: pathname,
          });
        } else if (type === 'Answer') {
          await downvoteAnswer({
            answerId: itemId,
            userId,
            hasupVoted,
            hasdownVoted,
            path: pathname,
          });
        }

        return toast.success(
          `Downvote ${!hasdownVoted ? 'Successful' : 'Removed'}`,
          {
            description: !hasdownVoted
              ? 'Your feedback has been recorded.'
              : 'Your downvote has been retracted.',
          },
        );
      }
    } catch (error) {
      console.error(error);
      return toast.error('Something went wrong', {
        description: 'Your vote could not be processed.',
      });
    }
  };

  const handleSave = async () => {
    if (!userId) {
      return toast.error('Please log in', {
        description: 'You must be logged in to save questions.',
      });
    }

    try {
      await saveQuestion({
        questionId: itemId,
        userId,
        path: pathname,
      });

      return toast.success(`Question ${!hasSaved ? 'Saved' : 'Unsaved'}`, {
        description: !hasSaved
          ? 'This question has been added to your collection.'
          : 'This question has been removed from your collection.',
      });
    } catch (error) {
      console.error(error);
      return toast.error('Error', {
        description: 'Could not save question.',
      });
    }
  };

  useEffect(() => {
    trackQuestionViews({
      userId,
      questionId: itemId,
    });
  }, [pathname, userId, itemId, router]);

  return (
    <div className='flex gap-5'>
      <div className='flex-center gap-2.5'>
        <div className='flex-center gap-1.5'>
          <Image
            src={
              hasupVoted
                ? '/assets/icons/upvoted.svg'
                : '/assets/icons/upvote.svg'
            }
            height={18}
            width={18}
            className='cursor-pointer'
            onClick={() => handleVote('upvote')}
            alt='upvote'
          />
          <div className='flex-center background-light700_dark400 min-w-4.5 rounded-sm p-1'>
            <p className='subtle-medium text-dark400_light900'>{upvotes}</p>
          </div>
        </div>

        <div className='flex-center gap-1.5'>
          <Image
            src={
              hasdownVoted
                ? '/assets/icons/downvoted.svg'
                : '/assets/icons/downvote.svg'
            }
            height={18}
            width={18}
            className='cursor-pointer'
            onClick={() => handleVote('downvote')}
            alt='downvote'
          />
          <div className='flex-center background-light700_dark400 min-w-4.5 rounded-sm p-1'>
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
