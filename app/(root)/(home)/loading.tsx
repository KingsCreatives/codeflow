import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
  return (
    <section>
      <div className='flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center'>
        <h1 className='h1-bold text-dark100_light900'>All Questions</h1>
        <Link href='/ask-question' className='flex justify-end max-sm:w-full'>
          <Button className='primary-gradient min-h-11.5 px-4 py-3 text-light-900!'>
            Ask a Question
          </Button>
        </Link>
      </div>

      <div className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
        <Skeleton className='h-14 flex-1 rounded-xl' /> 
        <div className='hidden max-md:block'>
          <Skeleton className='h-14 w-28 rounded-xl' />
        </div>
      </div>

      <div className='hidden flex-wrap gap-3 md:flex mt-10'>
        {[1, 2, 3, 4].map((item) => (
          <Skeleton key={item} className='h-9 w-20 rounded-md' />
        ))}
      </div>

      <div className='mt-10 flex w-full flex-col gap-6'>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <div key={item} className='card-wrapper rounded-[10px] p-9 sm:px-11'>
            <Skeleton className='h-6 w-3/4 rounded-md' />

            <div className='mt-3.5 flex gap-2'>
              <Skeleton className='h-8 w-16 rounded-md' />
              <Skeleton className='h-8 w-16 rounded-md' />
              <Skeleton className='h-8 w-16 rounded-md' />
            </div>

            <div className='flex-between mt-6 w-full flex-wrap gap-3'>
              <div className='flex items-center gap-2'>
                <Skeleton className='h-5 w-5 rounded-full' />
                <Skeleton className='h-4 w-20' />
              </div>

              <div className='flex gap-2'>
                <Skeleton className='h-4 w-12' />
                <Skeleton className='h-4 w-12' />
                <Skeleton className='h-4 w-12' />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Loading;
