'use client';
import React, { useEffect, useState } from 'react';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import GlobalFilters from './GlobalFilters';
import { globalSearch } from '@/lib/actions/global.action';

interface SearchResultItem {
  id: string;
  type: string;
  title: string;
  url: string;
}

const GlobalResult = () => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SearchResultItem[]>([]);

  const global = searchParams.get('global');
  const type = searchParams.get('type');

  useEffect(() => {
    const fetchResult = async () => {
      setResult([]);
      setIsLoading(true);

      try {
        const res = await globalSearch({ query: global, type });
        setResult(JSON.parse(res));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (global) fetchResult();
  }, [global, type]);

  const renderResultIcon = (type: string) => {
    switch (type) {
      case 'tag':
        return '/assets/icons/tag.svg';
      case 'user':
        return '/assets/icons/user.svg';
      case 'answer':
        return '/assets/icons/tag.svg'; 
      default:
        return '/assets/icons/question.svg'; 
    }
  };

  return (
    <div className='absolute top-full z-50 mt-3 w-full rounded-xl bg-light-800 py-5 shadow-sm dark:bg-dark-400 border border-light-700 dark:border-dark-500'>
      <GlobalFilters />

      <div className='my-4 h-px bg-light-700/50 dark:bg-dark-500/50' />

      <div className='space-y-5'>
        <p className='text-dark400_light900 paragraph-semibold px-5'>
          Top Match
        </p>

        {isLoading ? (
          <div className='flex-center flex-col px-5'>
            <div className='w-full space-y-2'>
              {[1, 2, 3].map((i) => (
                <div key={i} className='flex items-center gap-3 animate-pulse'>
                  <div className='h-8 w-8 rounded-full bg-light-700 dark:bg-dark-500'></div>
                  <div className='flex-1 space-y-2'>
                    <div className='h-4 w-3/4 bg-light-700 dark:bg-dark-500 rounded'></div>
                    <div className='h-3 w-1/4 bg-light-700 dark:bg-dark-500 rounded'></div>
                  </div>
                </div>
              ))}
            </div>
            <div className='mt-4 flex items-center gap-2'>
              <ReloadIcon className='my-2 h-10 w-10 animate-spin text-primary500' />
              <p className='text-dark200_light800 body-regular'>Searching...</p>
            </div>
          </div>
        ) : (
          <div className='flex flex-col gap-2'>
            {result.length > 0 ? (
              result.map((item: SearchResultItem, index: number) => (
                <Link
                  href={item.url}
                  key={item.type + item.id + index}
                  className='flex w-full cursor-pointer items-start gap-3 px-5 py-2.5 hover:bg-light-700/50 dark:hover:bg-dark-500/50 transition-colors border-b border-light-700/50 dark:border-dark-500/50 last:border-none'
                >
                  <Image
                    src={renderResultIcon(item.type)}
                    alt={item.type}
                    width={18}
                    height={18}
                    className='invert-colors mt-1 object-contain'
                  />
                  <div className='flex flex-col'>
                    <p className='body-medium text-dark200_light800 line-clamp-1 font-semibold'>
                      {item.title}
                    </p>
                    <p className='text-light400_light500 small-medium mt-1 capitalize'>
                      {item.type}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className='flex-center flex-col px-5 py-4'>
                <p className='text-dark200_light800 body-regular px-5 py-2.5 text-center'>
                  Oops, no results found for "{global}". <br />
                  <span className='text-light-500 text-xs'>
                    Try different keywords or check your spelling.
                  </span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalResult;
