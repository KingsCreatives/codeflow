"use client"

import Image from 'next/image'
import React from 'react'

interface VoteProps {
  type : string,
  itemId : string,
  userId : string, 
  upvotes: number,
  downvotes: number
  hasupVoted : boolean
  hasdownVoted: boolean
  hasSaved?: boolean
}

const Votes = ({
    type,
    itemId,
    userId,
    upvotes,
    downvotes,
    hasupVoted,
    hasdownVoted,
    hasSaved
} : VoteProps) => {
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
            onClick={() => {}}
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
            onClick={() => {}}
            alt='downvote'
          />
          <div className='flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1'>
            <p className='subtle-medium text-dark400_light900'>{downvotes}</p>
          </div>
        </div>
      </div>
      <Image
        src={
          hasSaved
            ? '/assets/icons/star-filled.svg'
            : '/assets/icons/star-red.svg'
        }
        height={18}
        width={18}
        className='cursor-pointer'
        onClick={() => {}}
        alt='saved'
      />
    </div>
  );
}

export default Votes