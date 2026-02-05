import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const Loading = () => {
  return (
    <section>
      <h1 className='h1-bold text-dark100_light900'>Edit Question</h1>

      <div className='mt-9 flex w-full flex-col gap-10'>
        <div className='flex flex-col gap-3'>
          <Skeleton className='h-6 w-24' /> 
          <Skeleton className='h-14 w-full rounded-lg' /> 
        </div>

        <div className='flex flex-col gap-3'>
          <Skeleton className='h-6 w-36' /> 
          <Skeleton className='h-87.5 w-full rounded-lg' />
        </div>

        <div className='flex flex-col gap-3'>
          <Skeleton className='h-6 w-16' /> 
          <Skeleton className='h-14 w-full rounded-lg' /> 
        </div>

        <Skeleton className='h-12 w-fit px-10 rounded-lg' />
      </div>
    </section>
  );
};

export default Loading;
