'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';

interface LocalSearchbarProps {
  route: string;
  placeholder: string;
  imgSrc: string;
  otherClasses?: string;
  iconPosition: string;
}

const LocalSearchbar = ({
  route,
  placeholder,
  imgSrc,
  otherClasses,
  iconPosition,
}: LocalSearchbarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get('q');

  const [search, setSearch] = useState(query || '');

  useEffect(() => {
    const debounceFn = setTimeout(() => {
      if (search) {
        const url = formUrlQuery({
          params: searchParams.toString(),
          key: 'q',
          value: search,
        });
        router.push(url, { scroll: false });
      } else {
        if (pathname === route) {
          const url = removeKeysFromQuery({
            params: searchParams.toString(),
            keys: ['q'],
          });
          router.push(url, { scroll: false });
        }
      }
    }, 300);
    return () => clearTimeout(debounceFn);
  }, [search, route, pathname, router, searchParams, query]);

  return (
    <div
      className={`background-light800_darkgradient flex min-h-14 grow items-center gap-4 rounded-[10px] px-3 ${otherClasses}`}
    >
      {iconPosition === 'left' && (
        <Image
          src={imgSrc}
          alt='search'
          width={20}
          height={20}
          className='cursor-pointer'
        />
      )}
      <Input
        type='text'
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        className='paragraph-regular no-focus placeholder background-light800_darkgradient border-none outline-none shadow-none grow'
      />
      {iconPosition === 'right' && (
        <Image
          src={imgSrc}
          alt='search'
          width={20}
          height={20}
          className='cursor-pointer'
        />
      )}
    </div>
  );
};

export default LocalSearchbar;
