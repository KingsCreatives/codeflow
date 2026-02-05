import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const Loading = () => {
  return (
    <section>
      <Skeleton className='h-12 w-52 mb-10' />

      <Skeleton className='mb-12 h-14 w-full rounded-xl' />

      <div className='mt-10 flex flex-col gap-6'>
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Loading;
