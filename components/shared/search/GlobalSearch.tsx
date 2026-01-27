'use client';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import GlobalResult from './GlobalResult';

const GlobalSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchContainerRef = useRef<HTMLDivElement>(null); 

  const query = searchParams.get('global'); 
  const [search, setSearch] = useState(query || '');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearch('');
      }
    };
    setIsOpen(false); 
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [pathname]);

  useEffect(() => {
    const debounceFn = setTimeout(() => {
      if (search) {
        const url = formUrlQuery({
          params: searchParams.toString(),
          key: 'global',
          value: search,
        });
        
        router.push(url, { scroll: false });
      } else if (query) {
        const url = removeKeysFromQuery({
          params: searchParams.toString(),
          keys: ['global', 'type'],
        });
        router.push(url, { scroll: false });
      }
    }, 300);

    return () => clearTimeout(debounceFn);
  }, [search, router, pathname, searchParams, query]);

  return (
    <div
      className='relative w-full max-w-150 max-lg:hidden'
      ref={searchContainerRef}
    >
      <div className='background-light800_darkgradient relative flex min-h-14 grow items-center gap-1 rounded-xl px-4 shadow-sm border border-transparent focus-within:border-primary-500 focus-within:shadow-md transition-all'>
        <Image
          src='/assets/icons/search.svg'
          alt='search'
          width={24}
          height={24}
          className='cursor-pointer opacity-50'
        />
        <Input
          type='text'
          placeholder='Search globally...'
          value={search}
          className='paragraph-regular no-focus placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none'
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen && e.target.value !== '') setIsOpen(true);
            if (e.target.value === '' && isOpen) setIsOpen(false);
          }}
        />
      </div>

      {isOpen && <GlobalResult />}
    </div>
  );
};

export default GlobalSearch;
