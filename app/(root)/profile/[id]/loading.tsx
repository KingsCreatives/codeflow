import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
  return (
    <section>
      <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
        <Skeleton className='h-28 rounded-md'/>
        <Skeleton className='h-28 rounded-md'/>
        <Skeleton className='h-28 rounded-md'/>
        <Skeleton className='h-28 rounded-md'/>
      </div>

        <div className="mt-10 flex gap-10">
            <div className="flex flex-1 flex-col">
                <div className="flex">
                    <Skeleton className='h-11 w-24 rounded-r-none'/>
                    <Skeleton className='h-11 w-24 rounded-r-none'/>
                </div>
            </div>
        </div>
    </section>
  );
};

export default Loading;
