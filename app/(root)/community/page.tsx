import React from 'react';
import Filter from '@/components/shared/Filter';
import LocalSearchbar from '@/components/shared/search/LocalSearchbar';
import { UserFilters } from '@/constants/filters';
import { getAllUsers } from '@/lib/actions/user.action';
import Link from 'next/link';
import { SearchParamsProps } from '@/types';

const Page = async ({searchParams}: SearchParamsProps) => {

  const result = await getAllUsers({searchQuery: searchParams.q});

  return (
    <>
      <h1 className='h1-bold text-dark100_light900'>All users</h1>
      <div className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
        <LocalSearchbar
          route='/community'
          iconPosition='left'
          imgSrc='/assets/search.svg'
          placeholder='search for amazing minds'
          otherClasses='flex-1'
        />
      </div>
    </>
  );
};

export default Page;
