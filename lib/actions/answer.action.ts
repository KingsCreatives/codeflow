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
    const { questionId, sortBy } = params;

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
    return { answers };
  } catch (error) {
    console.error('Error fetching answers:', error);
  }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    await connectDatabase();
    const { answerId, userId, hasdownVoted, hasupVoted, path } = params;
    let data = {};

    if (hasupVoted) {
      data = {
        upvotes: {
          disconnect: { id: userId },
        },
      };
    } else if (hasdownVoted) {
      data = {
        downvotes: {
          disconnect: { id: userId },
        },
        upvotes: {
          connect: { id: userId },
        },
      };
    } else {
      data = {
        upvotes: {
          connect: { id: userId },
        },
      };
    }

    const answer = await prisma.answer.update({
      where: { id: answerId },
      data,
      include: {
        upvotes: true,
        downvotes: true,
      },
    });

    if (!answer) {
      throw new Error('Answer not found');
    }

    revalidatePath(path);
  } catch (error) {}
}

export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    await connectDatabase();

    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;

    let data = {};

    if (hasdownVoted) {
      data = {
        downvotes: {
          disconnect: { id: userId },
        },
      };
    } else if (hasupVoted) {
      data = {
        upvotes: {
          disconnect: { id: userId },
        },
        downvotes: {
          connect: { id: userId },
        },
      };
    } else {
      data = {
        downvotes: {
          connect: { id: userId },
        },
      };
    }

    const answer = await prisma.answer.update({
      where: { id: answerId },
      data,
      include: {
        upvotes: true,
        downvotes: true,
      },
    });

    if (!answer) {
      throw new Error('Answer not found');
    }

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
