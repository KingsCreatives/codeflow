import { getAllUsers } from '@/lib/actions/user.action';
import Filter from '@/components/shared/Filter';
import LocalSearchbar from '@/components/shared/search/LocalSearchbar';
import { UserFilters } from '@/constants/filters';
import { SearchParamsProps } from '@/types';
import UserCard from '@/components/cards/UserCard';
import Pagination from '@/components/shared/Pagination';
import Link from 'next/link';

const Page = async ({ searchParams }: SearchParamsProps) => {
  const resolvedSearchParams = await searchParams;

  const { users: fetchedUsers = [], isNext } = await getAllUsers({
    searchQuery: resolvedSearchParams.q as string,
    filter: resolvedSearchParams.filter as string,
    page: resolvedSearchParams.page ? +resolvedSearchParams.page : 1,
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
        {fetchedUsers && fetchedUsers?.length > 0 ? (
          fetchedUsers?.map((user) => <UserCard key={user.id} user={user} />)
        ) : (
          <div className='paragraph-regular text-dark200_light800 mx-auto max-w-4xl'>
            <p>No users yet</p>
            <Link href='/sign-up' className='mt-1 font-bold text-accent-blue'>
              Be the first to join
            </Link>
          </div>
        )}
      </section>
      <div className='mt-10'>
        <Pagination
          pageNumber={
            resolvedSearchParams?.page ? +resolvedSearchParams.page : 1
          }
          isNext={isNext}
        />
      </div>
    </>
  );
};

export default Page;
