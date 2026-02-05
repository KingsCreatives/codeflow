import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const Loading = () => {
  return (
    <section>
      <div className='flex flex-col-reverse items-start justify-between sm:flex-row'>
        <div className='flex flex-col items-start gap-4 lg:flex-row'>
          <Skeleton className='h-35 w-35 rounded-full' />

          <div className='mt-3'>
            <Skeleton className='h-8 w-48' />
            <Skeleton className='h-5 w-24 mt-2' />
            <div className='mt-5 flex flex-wrap items-center justify-start gap-5'>
              <Skeleton className='h-5 w-20' /> 
            </div>
            <Skeleton className='mt-4 h-16 w-full sm:w-80' /> 
          </div>
        </div>

        <div className='flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3'>
          <Skeleton className='h-10 w-24 rounded-md' />
        </div>
      </div>

      <div className='mt-10 mb-10'>
        <h4 className='h3-semibold text-dark200_light900'>Stats</h4>
        <div className='mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4'>
          <Skeleton className='h-28 rounded-md shadow-light-300 dark:shadow-dark-200' />
          <Skeleton className='h-28 rounded-md shadow-light-300 dark:shadow-dark-200' />
          <Skeleton className='h-28 rounded-md shadow-light-300 dark:shadow-dark-200' />
          <Skeleton className='h-28 rounded-md shadow-light-300 dark:shadow-dark-200' />
        </div>
      </div>

      <div className='flex gap-10'>
        <div className='flex flex-1 flex-col gap-6'>
          <div className='flex'>
            <Skeleton className='h-10 w-24 rounded-l-lg' />
            <Skeleton className='h-10 w-24 rounded-r-lg' />
          </div>

          <div className='flex flex-col gap-6 w-full'>
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className='card-wrapper rounded-[10px] p-9 sm:px-11'
              >
                <Skeleton className='h-6 w-3/4' />
                <div className='mt-3 flex gap-2'>
                  <Skeleton className='h-6 w-16' />
                  <Skeleton className='h-6 w-16' />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Loading;
