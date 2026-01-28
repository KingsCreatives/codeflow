'use server';

import { connectDatabase } from '../db/dbcheck';
import { prisma } from '@/lib/db/client';
import { Prisma } from '@prisma/client';
import {
  CreateQuestionParams,
  GetQuestionsParams,
  GetQuestionByIdParams,
  QuestionVoteParams,
  DeleteQuestionParams,
  EditQuestionParams,
} from '../shared.types';
import { revalidatePath } from 'next/cache';

export async function getQuestions(params: GetQuestionsParams) {
  try {
    await connectDatabase();

    const { searchQuery, filter, page = 1, pageSize = 20 } = params;

    const skipPages = (page - 1) * pageSize;

    const query: Prisma.QuestionWhereInput = {};
    if (searchQuery) {
      query.OR = [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { content: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    let sortFilters = {};

    switch (filter) {
      case 'newest':
        sortFilters = { createdAt: 'desc' };
        break;
      case 'frequent':
        sortFilters = { views: 'desc' };
        break;
      case 'unanswered':
        query.answers = {
          none: {},
        };
        break;
      default:
        break;
    }

    const questions = await prisma.question.findMany({
      where: query,
      take: pageSize,
      skip: skipPages,
      include: {
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            picture: true,
            clerkId: true,
          },
        },
        upvotes: { select: { id: true } },
        downvotes: { select: { id: true } },
        _count: {
          select: {
            answers: true,
          },
        },
      },
      orderBy:
        Object.keys(sortFilters).length > 0
          ? sortFilters
          : { createdAt: 'desc' },
    });

    const totalQuestions = await prisma.question.count({
      where: query,
    });

    const isNext = totalQuestions > skipPages + questions.length;

    return { questions, isNext };
  } catch (error) {
    console.error('Error fetching questions:', error);
    return {
      questions: [],
      isNext: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    await connectDatabase();
    const { title, content, tags, author, path } = params;

    const normalizedTags = tags.map((tag: string) => tag.trim().toLowerCase());
    const tagDocuments = [];

    for (const tag of normalizedTags) {
      const existingTag = await prisma.tag.findFirst({
        where: {
          name: {
            equals: tag,
            mode: 'insensitive',
          },
        },
      });

      let tagRecord = existingTag;
      if (!existingTag) {
        tagRecord = await prisma.tag.create({
          data: { name: tag },
        });
      }

      if (tagRecord) {
        tagDocuments.push({ id: tagRecord.id });
      }
    }

    const question = await prisma.question.create({
      data: {
        title,
        content,
        author: { connect: { id: author } },
        tags: { connect: tagDocuments },
      },
    });

    await prisma.user.update({
      where: {id: author},
      data: {
        reputation: {increment: 5},
        Interaction: {
          create: {
            action: "ask_question",
            question: {connect: {id: question.id}},
            tags: {connect : tagDocuments}
          }
        }
      }
    })

    revalidatePath(path);
    return { question };
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    await connectDatabase();

    const { questionId } = params;

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
        upvotes: true,
        downvotes: true,
        author: {
          select: {
            id: true,
            clerkId: true,
            name: true,
            picture: true,
            savedQuestions: true,
          },
        },
        answers: {
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
        },
      },
    });

    return { question };
  } catch (error) {
    console.error('Error fetching question:', error);
    return {
      question: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    await connectDatabase();

    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};
    let authorRepChange = 0;
    let voterRepChange = 0;

    if (hasupVoted) {
      updateQuery = { upvotes: { disconnect: { id: userId } } };
      authorRepChange = -10; 
      voterRepChange = -1; 
    } else if (hasdownVoted) {
      
      updateQuery = {
        downvotes: { disconnect: { id: userId } },
        upvotes: { connect: { id: userId } },
      };
      authorRepChange = 12;
      voterRepChange = 2;
    } else {
      updateQuery = { upvotes: { connect: { id: userId } } };
      authorRepChange = 10;
      voterRepChange = 1;
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: { authorId: true },
    });

    if (!question) throw new Error('Question not found');

    if (question.authorId === userId) {
      authorRepChange = 0;
      voterRepChange = 0;
    }

    await prisma.$transaction([
      
      prisma.question.update({
        where: { id: questionId },
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
              where: { id: question.authorId },
              data: { reputation: { increment: authorRepChange } },
            }),
          ]
        : []),
    ]);

    revalidatePath(path);
  } catch (error) {
    console.error('Error in upvoteQuestion:', error);
    throw error;
  }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    await connectDatabase();

    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

    let data = {};

    if (hasdownVoted) {
      //  User has already downvoted → remove the downvote
      data = {
        downvotes: {
          disconnect: { id: userId },
        },
      };
    } else if (hasupVoted) {
      // User had upvoted → remove upvote, add downvote
      data = {
        upvotes: {
          disconnect: { id: userId },
        },
        downvotes: {
          connect: { id: userId },
        },
      };
    } else {
      //  User hasn't voted → just add a downvote
      data = {
        downvotes: {
          connect: { id: userId },
        },
      };
    }

    const question = await prisma.question.update({
      where: { id: questionId },
      data,
      include: {
        upvotes: true,
        downvotes: true,
      },
    });

    if (!question) {
      throw new Error('Question not found');
    }

    revalidatePath(path);
    return question;
  } catch (error) {
    console.error('Error in downvoteQuestion:', error);
    throw error;
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    connectDatabase();

    const { questionId, path } = params;

    await prisma.question.delete({
      where: {
        id: questionId,
      },
    });

    await prisma.answer.deleteMany({
      where: {
        questionId: questionId,
      },
    });

    await prisma.interaction.deleteMany({
      where: {
        questionId: questionId,
      },
    });

    await prisma.$executeRaw`
      UPDATE "Tag"
      SET "questions" = array_remove("questions", ${questionId}::text)
      WHERE ${questionId} = ANY("questions");
`;

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    connectDatabase();

    const { questionId, path, title, content } = params;

    const question = await prisma.question.findFirst({
      where: {
        id: questionId,
      },
      include: {
        tags: true,
      },
    });

    if (!question) {
      throw new Error('Question not found');
    }

    await prisma.question.update({
      where: {
        id: questionId,
      },
      data: {
        title: title,
        content: content,
      },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function getTopQuestions() {
  try {
    connectDatabase();

    const topQuestions = await prisma.question.findMany({
      take: 5,
      orderBy: [{ views: 'desc' }, { upvotes: { _count: 'desc' } }],
    });

    return topQuestions;
  } catch (error) {
    console.log(error);
  }
}
