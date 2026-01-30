import React from 'react';
import Image from 'next/image';
import { formatNumber } from '@/lib/utils';

interface StatsCardProps {
  imgUrl: string;
  value: number;
  title: string;
}

interface UserStatProps {
  totalAnswers: number;
  totalQuestions: number;
  badges: {
    GOLD: number;
    SILVER: number;
    BRONZE: number;
  };
}

const StatsCard = ({ imgUrl, value, title }: StatsCardProps) => {
  return (
    <div className='light-border background-light900_dark300 flex flex-wrap items-center justify-start gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200 transition-all hover:shadow-lg dark:hover:shadow-dark-100'>
      <Image
        src={imgUrl}
        alt={title}
        width={40}
        height={50}
        className='object-contain'
      />
      <div>
        <p className='paragraph-semibold text-dark200_light900 text-[20px]'>
          {value}
        </p>
        <p className='body-medium text-dark400_light700 capitalize'>{title}</p>
      </div>
    </div>
  );
};

const UserStats = ({ totalQuestions, totalAnswers, badges }: UserStatProps) => {
  return (
    <div className='mt-10'>
      <h4 className='h3-semibold text-dark200_light900'>Stats</h4>

      <div className='mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4'>
        <div className='light-border background-light900_dark300 flex flex-wrap items-center justify-start gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200 transition-all hover:shadow-lg dark:hover:shadow-dark-100'>
          <div className='flex-center h-10 w-10 rounded-full bg-primary-500/10'>
            <span className='text-primary-500 font-bold text-lg'>?</span>
          </div>
          <div>
            <p className='paragraph-semibold text-dark200_light900 text-[20px]'>
              {formatNumber(totalQuestions)}
            </p>
            <p className='body-medium text-dark400_light700'>
              {Number(formatNumber(totalQuestions)) < 2 ? 'Question' : 'Questions'}
            </p>
          </div>
        </div>

        <div className='light-border background-light900_dark300 flex flex-wrap items-center justify-start gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200 transition-all hover:shadow-lg dark:hover:shadow-dark-100'>
          <div className='flex-center h-10 w-10 rounded-full bg-primary-500/10'>
            <span className='text-primary-500 font-bold text-lg'>A</span>
          </div>
          <div>
            <p className='paragraph-semibold text-dark200_light900 text-[20px]'>
              {formatNumber(totalAnswers)}
            </p>
            <p className='body-medium text-dark400_light700'>
              {Number(formatNumber(totalAnswers)) < 2 ? 'Answer' : 'Answers'}
            </p>
          </div>
        </div>

        <StatsCard
          imgUrl='/assets/icons/gold-medal.svg'
          value={badges.GOLD}
          title={badges.GOLD < 2 ? 'Gold Badge' : 'Gold Badges'}
        />
        <StatsCard
          imgUrl='/assets/icons/silver-medal.svg'
          value={badges.SILVER}
          title={badges.SILVER < 2 ? 'Silver Badge' : 'Silver Badges'}
        />
        <StatsCard
          imgUrl='/assets/icons/bronze-medal.svg'
          value={badges.BRONZE}
          title={badges.BRONZE < 2 ? 'Bronze Badge' : 'Bronze Badges'}
        />
      </div>
    </div>
  );
};

export default UserStats;
