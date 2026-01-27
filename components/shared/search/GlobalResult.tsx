'use client';

import React, { useEffect, useState } from 'react';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import GlobalFilters from './GlobalFilters';
import { globalSearch } from '@/lib/actions/global.action';

const GlobalResult = () => {
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState([]);

  const global = searchParams.get('global');
  const type = searchParams.get('type');

  const renderLink = (type: string, id: string) => {
    switch (type) {
      case 'question':
        return `/question/${id}`;
        break;
      case 'answer':
        return `/question/${id}`;
        break;
      case 'user':
        return `/profile/${id}`;
        break;
      case 'tag':
        return `/tags/${id}`;
        break;
      default:
        return '/';
    }
  };

  useEffect(() => {
    const fetchedResult = async () => {
      setResult([]);
      setIsLoading(true);

      try {
        const res = await globalSearch({ query: global, type });

        setResult(JSON.parse(res));
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    };
    if (global) {
      fetchedResult();
    }
  }, [global, type]);

  return (
    <div className='absolute top-full z-10 mt-3 w-full background-light800_dark400 py-5 shadow-sm rounded-xl'>
      <div className='space-y-5'>
        <div className='text-dark400_light900 px-5 paragraph-semibold'>
          <GlobalFilters />
        </div>
      </div>

      {/* Separator: Updated to use composite class for correct theme switching */}
      <div className='my-5 h-px background-light700_dark300'>
        <div className='space-y-5'>
          <p className='text-dark400_light900 px-5 paragraph-semibold pt-5'>
            Top Match
          </p>

          {isLoading ? (
            <div className='flex-center flex-col px-5'>
              <ReloadIcon className='my-2 h-10 w-10 text-primary500 animate-spin' />
              <p className='text-dark200_light800 body-regular'>
                Fetching Data
              </p>
            </div>
          ) : (
            <div className='flex flex-col gap-2'>
              {result.length > 0 ? (
                result.map((item: any, index: number) => (
                  <Link
                    href={renderLink(item.type, item.id)}
                    key={item.type + item.id + index}
                    className='flex w-full cursor-pointer items-start gap-3 px-5 py-3 hover:background-light700_dark300 transition-colors'
                  >
                    <Image
                      src={'/assets/icons/tags.svg'}
                      alt='tag'
                      height={18}
                      width={18}
                      className='invert-colors object-contain mt-1'
                    />
                    <div className='flex flex-col'>
                      <p className='body-medium text-dark200_light800 line-clamp-1'>
                        {item.title}
                      </p>
                      <p className='text-light400_light500 small-medium mt-1 font-bold capitalize'>
                        {item.type}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className='flex-center flex-col px-5'>
                  <p className='text-dark200_light800 body-regular px-5 py-3'>
                    Oops, no results found
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalResult;
