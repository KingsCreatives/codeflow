import HomeFilters from '@/components/Home/HomeFilters';
import Filter from '@/components/shared/Filter';
import LocalSearchbar from '@/components/shared/search/LocalSearchbar';
import { QuestionFilters } from '@/constants/filters';
import NoResult from '@/components/shared/NoResult';
import QuestionCard from '@/components/cards/QuestionCard';
import { formatNumber } from '@/lib/utils';
import { getAllSavedQuestions } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs/server';

export default async function Home() {
  const { userId } = await auth();

  const { savedQuestions, totalCount } = await getAllSavedQuestions({
    clerkId: userId || '',
  });

  return (
    <>
      <h1 className='h1-bold text-dark100_light900'>Saved Questions</h1>

      <div className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
        <LocalSearchbar
          route='/'
          placeholder='Search for questions, topics, or tags...'
          iconPosition='left'
          imgSrc='/assets/icons/search.svg'
          otherClasses='flex-1'
        />
        <Filter
          filters={QuestionFilters}
          otherClasses='min-h-[56px] sm:min-w-[170px]'
        />
      </div>

      <HomeFilters />

      <div className='mt-10 flex w-full flex-col gap-6'>
        {/* FIXED: Check array length, not object property */}
        {savedQuestions.length > 0 ? (
          savedQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              id={question.id}
              title={question.title}
              tags={question.tags.map((tag) => ({
                id: tag.id,
                name: tag.name,
              }))}
              upvotes={formatNumber(0)}
              views={formatNumber(question.views)}
              author={{
                picture: question.author.picture,
                id: question.author.id,
                name: question.author.name,
              }}
              answerCount={question._count.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title='No saved questions found'
            description="You haven't saved any questions yet. Start exploring and save questions that interest you!"
            link='/ask-question'
            linkTitle='Ask a Question'
          />
        )}
      </div>
    </>
  );
}
