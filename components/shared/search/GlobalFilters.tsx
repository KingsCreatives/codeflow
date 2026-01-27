'use client';
import React, { useState } from 'react';
import { GlobalSearchFilters } from '@/constants/filters';
import { useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery } from '@/lib/utils';

const GlobalFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParams = searchParams.get('type');
  const [active, setActive] = useState(typeParams || '');

  const handleTypeClick = (item: string) => {
    let newUrl = '';

    if (active === item) {
      setActive('');
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'type',
        value: null,
      });
    } else {
      setActive(item);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'type',
        value: item.toLowerCase(),
      });
    }
    router.replace(newUrl, { scroll: false });
  };

  return (
    <div className='flex items-center gap-4 px-5 pt-3 pb-1'>
      <p className='text-dark400_light900 body-medium'>Filter:</p>
      <div className='flex gap-2.5'>
        {GlobalSearchFilters.map((item) => (
          <button
            type='button'
            key={item.value}
            onClick={() => handleTypeClick(item.value)}
            className={`
              small-medium rounded-full px-4 py-2 capitalize transition-all cursor-pointer
              ${
                active === item.value
                  ? 'bg-primary-500 text-light-900 shadow-md'
                  : 'bg-light-700 text-dark-400 hover:text-primary-500 hover:bg-light-800 dark:bg-dark-500 dark:text-light-800 dark:hover:text-primary-500'
              }
            `}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GlobalFilters;
