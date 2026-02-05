import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const Loading = () => {
  return (
    <section>
      <div className='flex-start w-full flex-col'>
        <div className='flex w-full'>
          <Skeleton className='h-6 w-24' />
        </div>

        <div className='mt-5 w-full'>
          <Skeleton className='h-12 w-full sm:w-3/4' />
        </div>

        <div className='mt-6 flex w-full flex-wrap gap-4'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-6 w-6 rounded-full' />
            <Skeleton className='h-5 w-24' />
          </div>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-5 w-16' />
            <Skeleton className='h-5 w-16' />
          </div>
        </div>
      </div>

      <div className='mt-10 w-full space-y-4'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-60 w-full rounded-xl' />{' '}
        <Skeleton className='h-4 w-full' />
      </div>

      <div className='mt-8 flex flex-wrap gap-2'>
        <Skeleton className='h-8 w-20 rounded-md' />
        <Skeleton className='h-8 w-20 rounded-md' />
        <Skeleton className='h-8 w-20 rounded-md' />
      </div>

      <div className='mt-12'>
        <Skeleton className='h-8 w-32 mb-6' /> 
        <div className='flex flex-col gap-6'>
          {[1, 2, 3].map((item) => (
            <div key={item} className='w-full rounded-xl border p-6'>
              <div className='flex items-center gap-3'>
                <Skeleton className='h-8 w-8 rounded-full' />
                <Skeleton className='h-5 w-24' />
                <Skeleton className='ml-auto h-4 w-16' />
              </div>
              <div className='mt-4 space-y-3'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-5/6' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Loading;
