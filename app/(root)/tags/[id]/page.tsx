import React from 'react'
import { getQuestionsByTagId } from '@/lib/actions/tag.action'
import NoResult from '@/components/shared/NoResult'
import QuestionCard from '@/components/cards/QuestionCard'
import { formatNumber } from '@/lib/utils'
import LocalSearchbar from '@/components/shared/search/LocalSearchbar'
import { URLProps } from '@/types'

const Page =  async ({params, searchParams}: URLProps) => {

  const {id} = await params
  const resolvedSearchParams = await searchParams

    const result = await getQuestionsByTagId({
      tagId: id,
      page: resolvedSearchParams.page ? parseInt(resolvedSearchParams.page as string) : 1,
      pageSize: resolvedSearchParams.pageSize ? parseInt(resolvedSearchParams.pageSize as string) : 10,
      searchQuery: resolvedSearchParams.searchQuery as string || '',
    })

  const tag = result.tagName[0].toUpperCase() + result.tagName.slice(1) || 'Tag';
    
  return (
    <>
      <h1 className='h1-bold text-dark100_light900'>{tag}</h1>

      <div className='mt-11 w-full'>
        <LocalSearchbar
          route='/'
          placeholder='Search for questions, topics, or tags...'
          iconPosition='left'
          imgSrc='/assets/icons/search.svg'
          otherClasses='flex-1'
        />
      </div>

      <div className='mt-10 flex w-full flex-col gap-6'>
        {/* FIXED: Check array length, not object property */}
        {result.savedQuestions.length > 0 ? (
          result.savedQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              id={question.id}
              title={question.title}
              tags={question.tags.map((tag) => ({
                id: tag.id,
                name: tag.name,
              }))}
              voteCount={formatNumber(0)}
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

export default Page