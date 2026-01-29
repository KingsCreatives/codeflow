'use server';

import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from '../shared.types';
import { connectDatabase } from '../db/dbcheck';
import { prisma } from '@/lib/db/client';
import { revalidatePath } from 'next/cache';

export async function createAnswer(params: CreateAnswerParams) {
  try {
    await connectDatabase();
    const { content, question, author, path } = params;

    const questionDetails = await prisma.question.findUnique({
      where: {id: question},
      include: {tags: true}
    })

    if(!questionDetails) throw new Error('Question not found')

    const answer = await prisma.answer.create({
      data: {
        content,
        question: {
          connect: { id: question },
        },
        author: {
          connect: { id: author },
        },
      },
    });

    await prisma.user.update({
      where: { id: author },
      data: {
        reputation: { increment: 10 },
        Interaction: {
          create: {
            action: 'anwser',
            answer: { connect: { id: answer.id } },
            question: {connect: {id: question}},
            tags: {connect : questionDetails.tags.map((tag) => ({id: tag.id}))}
          },
        },
      },
    });

    revalidatePath(path);
    return { answer };
  } catch (error) {
    console.error('Error creating answer:', error);
    return {
      answer: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function getAllAnswers(params: GetAnswersParams) {
  try {
    await connectDatabase();
    const { questionId, sortBy, page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;

    let orderByOptions = {};

    switch (sortBy) {
      case 'highestUpvotes':
        orderByOptions = { upvotes: { _count: 'desc' } };
        break;
      case 'lowestUpvotes':
        orderByOptions = { upvotes: { _count: 'asc' } };
        break;
      case 'recent':
        orderByOptions = { created: 'desc' };
        break;
      case 'old':
        orderByOptions = { createdAt: 'asc' };
        break;
      default:
        orderByOptions = { createdAt: 'desc' };
        break;
    }

    const answers = await prisma.answer.findMany({
      where: { questionId: questionId },
      take: pageSize,
      skip: skipAmount,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            picture: true,
          },
        },
        upvotes: true,
        downvotes: true,
      },
      orderBy: orderByOptions,
    });

    const answerCount = await prisma.answer.count({
      where: { questionId: questionId },
    });

    const isNext = answerCount > skipAmount + answers.length

    return { answers, isNext};
  } catch (error) {
    console.error('Error fetching questions:', error);
    return {
      questions: [],
      isNext: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    await connectDatabase();

    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};
    let authorRepChange = 0;
    let voterRepChange = 0;

    if (hasupVoted) {
      updateQuery = { upvotes: { disconnect: { id: userId } } };
      authorRepChange = -10;
      voterRepChange = -2; 
    } else if (hasdownVoted) {
      updateQuery = {
        downvotes: { disconnect: { id: userId } },
        upvotes: { connect: { id: userId } },
      };
      
      authorRepChange = 12;
      
      voterRepChange = 3;
    } else {
      updateQuery = { upvotes: { connect: { id: userId } } };
      authorRepChange = 10;
      voterRepChange = 2; 
    }

    const answer = await prisma.answer.findUnique({
      where: { id: answerId },
      select: { authorId: true },
    });

    if (!answer) throw new Error('Answer not found');

    if (answer.authorId === userId) {
      authorRepChange = 0;
      voterRepChange = 0;
    }

    await prisma.$transaction([
      prisma.answer.update({
        where: { id: answerId },
        data: updateQuery,
      }),

      ...(voterRepChange !== 0
        ? [
            prisma.user.update({
              where: { id: userId },
              data: { reputation: { increment: voterRepChange } },
            }),
          ]
        : []),

      ...(authorRepChange !== 0
        ? [
            prisma.user.update({
              where: { id: answer.authorId },
              data: { reputation: { increment: authorRepChange } },
            }),
          ]
        : []),
    ]);

    revalidatePath(path);
  } catch (error) {
    console.error('Error in upvoteAnswer:', error);
    throw error;
  }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    await connectDatabase();

    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};
    let authorRepChange = 0;
    let voterRepChange = 0;

    if (hasdownVoted) {
      updateQuery = { downvotes: { disconnect: { id: userId } } };
      authorRepChange = 2; 
      voterRepChange = 1; 
    } else if (hasupVoted) {
      updateQuery = {
        upvotes: { disconnect: { id: userId } },
        downvotes: { connect: { id: userId } },
      };
    
      authorRepChange = -12; 
      
      voterRepChange = -3;   
    } else {
      updateQuery = { downvotes: { connect: { id: userId } } };
      authorRepChange = -2;
      voterRepChange = -1;
    }

    const answer = await prisma.answer.findUnique({
      where: { id: answerId },
      select: { authorId: true }
    });

    if (!answer) throw new Error("Answer not found");

    if (answer.authorId === userId) {
      authorRepChange = 0;
      voterRepChange = 0;
    }

    await prisma.$transaction([
      prisma.answer.update({
        where: { id: answerId },
        data: updateQuery,
      }),
      
      ...(voterRepChange !== 0 ? [
        prisma.user.update({
          where: { id: userId },
          data: { reputation: { increment: voterRepChange } },
        })
      ] : []),

      ...(authorRepChange !== 0 ? [
        prisma.user.update({
          where: { id: answer.authorId },
          data: { reputation: { increment: authorRepChange } },
        })
      ] : []),
    ]);

    revalidatePath(path);
  } catch (error) {
    console.error('Error in downvoteAnswer:', error);
    throw error;
  }
}

export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    connectDatabase();

    const { answerId, path } = params;

    const answer = await prisma.answer.findUnique({ where: { id: answerId } });

    if (!answer) {
      throw new Error('Answer not found');
    }

    await prisma.answer.delete({ where: { id: answerId } });

    await prisma.interaction.deleteMany({
      where: {
        answerId: answerId,
      },
    });

    await prisma.$executeRaw`
      UPDATE "Tag"
      SET "answers" = array_remove("answers", ${answerId}::text)
      WHERE ${answerId} = ANY("answers");
`;

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}
