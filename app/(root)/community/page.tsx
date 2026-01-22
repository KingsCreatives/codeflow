import { getAllUsers } from '@/lib/actions/user.action';
import Filter from '@/components/shared/Filter';
import LocalSearchbar from '@/components/shared/search/LocalSearchbar';
import { UserFilters } from '@/constants/filters';
import NoResult from '@/components/shared/NoResult';
import QuestionCard from '@/components/cards/QuestionCard';
import Link from 'next/link';
import { formatNumber } from '@/lib/utils';
import { getQuestions } from '@/lib/actions/question.action';
import { SearchParamsProps } from '@/types';
import UserCard from '@/components/cards/UserCard';

const Page = async ({ searchParams }: SearchParamsProps) => {
  const resolvedSearchParams = await searchParams;

  const result = await getAllUsers({
    searchQuery: resolvedSearchParams.q as string,
    filter: resolvedSearchParams.filter as string,
  });

  return (
    <>
      <h1 className='h1-bold text-dark100_light900'>All Users</h1>

      <div className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
        <LocalSearchbar
          route='/community'
          placeholder='Search for other brilliant minds'
          iconPosition='left'
          imgSrc='/assets/icons/search.svg'
          otherClasses='flex-1'
        />
        <Filter
          filters={UserFilters}
          otherClasses='min-h-[56px] sm:min-w-[170px]'
        />
      </div>

      <section className='mt-12 flex flew-wrap gap-4'>
        {result && result?.users.length > 0 ? (
          result?.users.map((user) => <UserCard key={user.id} user={user} />)
        ) : (
          <div className='paragraph-regular text-dark200_light800 mx-auto max-w-4xl'>
            <p>No users yet</p>
            <Link href='/sign-up' className='mt-1 font-bold text-accent-blue'>
              Be the first to join
            </Link>
          </div>
        )}
      </section>
    </>
  );
};

export default Page;
