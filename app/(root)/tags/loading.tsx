import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const Loading = () => {
  return (
    <section>
      <h1 className='h1-bold text-dark100_light900'>All Tags</h1>

      <div className='mb-12 mt-11 flex flex-wrap gap-5'>
        <Skeleton className='h-14 flex-1 rounded-xl' />
        <Skeleton className='h-14 w-28 rounded-xl' />
      </div>

      <div className='flex flex-wrap gap-4'>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <div
            key={item}
            className='background-light900_dark200 light-border flex h-60 w-full flex-col rounded-2xl border px-8 py-10 sm:w-65'
          >
            <Skeleton className='h-9 w-20 rounded-md' />

            <div className='mt-4 flex flex-col gap-2'>
              <Skeleton className='h-3 w-full' />
              <Skeleton className='h-3 w-4/5' />
              <Skeleton className='h-3 w-1/2' />
            </div>

            <div className='mt-auto flex w-full items-center gap-2'>
              <Skeleton className='h-4 w-14' />
              <Skeleton className='h-4 w-10' />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Loading;
