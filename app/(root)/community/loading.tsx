import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
  return (
    <section>
      <h1 className='h1-bold text-dark100_light900'>All Users</h1>

      <div className='mb-12 mt-11 flex flex-wrap gap-5'>
        <Skeleton className='h-14 flex-1 rounded-xl' /> 
        <Skeleton className='h-14 w-28 rounded-xl' /> 
      </div>

      <div className='flex flex-wrap gap-4'>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <div
            key={item}
            className='background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8 xs:w-[260px]'
          >
            <Skeleton className='h-25 w-25 rounded-full' />

            <div className='mt-4 text-center'>
              <Skeleton className='h-4 w-32' /> 
              <Skeleton className='mt-2 h-3 w-20 mx-auto' />
            </div>

            <div className='mt-5 flex items-center gap-2'>
              <Skeleton className='h-8 w-16 rounded-md' />
              <Skeleton className='h-8 w-16 rounded-md' />
              <Skeleton className='h-8 w-16 rounded-md' />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Loading;
