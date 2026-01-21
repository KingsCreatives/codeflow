import HomeFilters from '@/components/Home/HomeFilters';
import Filter from '@/components/shared/Filter';
import LocalSearchbar from '@/components/shared/search/LocalSearchbar';
import { Button } from '@/components/ui/button';
import { HomePageFilters } from '@/constants/filters';
import NoResult from '@/components/shared/NoResult';
import QuestionCard from '@/components/cards/QuestionCard';
import Link from 'next/link';
import { formatNumber } from '@/lib/utils';
import { getQuestions } from '@/lib/actions/question.action';
import { SearchParamsProps } from '@/types';

export default async function Home({ searchParams }: SearchParamsProps) {
  const resolvedSearchParams = await searchParams;
  const { questions: fetchedQuestions = [] } = await getQuestions({
    searchQuery: resolvedSearchParams.q as string,
    filter: resolvedSearchParams.filter as string,
  });

  return (
    <>
      <div className='flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center'>
        <h1 className='h1-bold text-dark100_light900'>All Questions</h1>
        <Link href='/ask-question' className='flex justify-end max-sm:w-full'>
          <Button className='primary-gradient min-h[46px] px-4 py-3 text-light-900! cursor-pointer'>
            Ask a Question
          </Button>
        </Link>
      </div>

      <div className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
        <LocalSearchbar
          route='/'
          placeholder='Search for questions, topics, or tags...'
          iconPosition='left'
          imgSrc='/assets/icons/search.svg'
          otherClasses='flex-1'
        />
        <Filter
          filters={HomePageFilters}
          otherClasses='min-h-[56px] sm:min-w-[170px]'
          containerClasses='hidden max-md:flex'
        />
      </div>

      <HomeFilters />

      <div className='mt-10 flex w-full flex-col gap-6'>
        {fetchedQuestions.length ? (
          fetchedQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              id={question.id}
              title={question.title}
              tags={question.tags.map((tag) => ({
                id: tag.id,
                name: tag.name,
              }))}
              views={formatNumber(question.views)}
              author={{
                picture: question.author.picture,
                id: question.author.id,
                name: question.author.name,
              }}
              answerCount={question._count.answers}
              createdAt={question.createdAt}
              voteCount={formatNumber(
                (question.upvotes?.length ?? 0) -
                  (question.downvotes?.length ?? 0),
              )}
            />
          ))
        ) : (
          <NoResult
            title="There's no question to show"
            description='It looks like there aren’t any questions here yet.'
            link='/ask-question'
            linkTitle='Ask a Question'
          />
        )}
      </div>
    </>
  );
}
