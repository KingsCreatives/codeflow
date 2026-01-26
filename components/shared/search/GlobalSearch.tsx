'use client';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import GlobalResult from './GlobalResult';

const GlobalSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get('q');

  const [search, setSearch] = useState(query || '');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const debounceFn = setTimeout(() => {
      if (search) {
        const url = formUrlQuery({
          params: searchParams.toString(),
          key: 'global',
          value: search,
        });
        router.push(url, { scroll: false });
      } else {
        if (query) {
          const url = removeKeysFromQuery({
            params: searchParams.toString(),
            keys: ['global', 'type'],
          });
          router.push(url, { scroll: false });
        }
      }
    }, 300);
    return () => clearTimeout(debounceFn);
  }, [search, pathname, router, searchParams, query]);

  return (
    <div className='relative w-full max-w-150 max-lg:hidden'>
      <div className='background-light800_darkgradient relative flex min-h-14 grow items-center gap-1 rounded-xl px-4'>
        <Image
          src='/assets/icons/search.svg'
          alt='search'
          width={24}
          height={24}
          className='cursor-pointer'
        />
        <Input
          type='text'
          placeholder='search'
          className='paragraph-regular no-focus placeholder text-dark400_light700 border-none shadow-none outline-none text-dark400_light700'
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (e.target.value === '' && isOpen) setIsOpen(false);
          }}
        />
      </div>
      {isOpen && <GlobalResult />}
    </div>
  );
};

export default GlobalSearch;
