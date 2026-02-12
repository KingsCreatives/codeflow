'use client';
import { HomePageFilters } from '@/constants/filters';
import { Button } from '@/components/ui/button';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { formUrlQuery } from '@/lib/utils';

const HomeFilters = () => {

  const [active, setActive] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTypeClick = (item: string) => {
    if (active === item) {
      setActive('');
      const url = formUrlQuery({
        params: searchParams.toString(),
        key: 'filter',
        value: null,
      });
      router.push(url, { scroll: false });
    } else {
      setActive(item);

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'filter',
        value: item.toLowerCase(),
      });

      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className='mt-10 flex-wrap gap-3 hidden md:flex'>
      {HomePageFilters.map((item) => (
        <Button
          key={item.value}
          onClick={() => handleTypeClick(item.value)}
          className={` body-medium rounded-lg px-6 py-4 capitalize shadow-none transition-transform duration-150 hover:scale-105 cursor-pointer text-dark400_light700 background-light800_dark300 ${
            active === item.value
              ? 'bg-primary-100 text-primary-500 hover:bg-primary-100 '
              : 'text-light-500'
          }`}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
