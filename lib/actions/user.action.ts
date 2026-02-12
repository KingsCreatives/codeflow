'use server';

import { connectDatabase } from '../db/dbcheck';
import { prisma } from '@/lib/db/client';
import { Prisma } from '@prisma/client';
import { assignBadges } from '../utils';

import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from '../shared.types';
import { revalidatePath } from 'next/cache';
import { QuestionWithDetails, SavedQuestionsResponse } from '../shared.types';

export async function getUserById(params: any) {
  try {
    await connectDatabase();
    const { userId } = params;
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function createUser(data: CreateUserParams) {
  try {
    await connectDatabase();
    if (!data.username) {
      throw new Error('Username is required');
    }
    const newUser = await prisma.user.create({
      data,
    });
    return newUser;
  } catch (error) {
    console.error(error);
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    await connectDatabase();
    const { clerkId, updateData, path } = params;

    const userUpdatedData = await prisma.user.update({
      where: {
        clerkId,
      },
      data: {
        ...updateData,
      },
    });
    revalidatePath(path);
    return userUpdatedData;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    await connectDatabase();
    const { clerkId } = params;

    const userToDelete = await prisma.user.findUnique({
      where: {
        clerkId,
      },
    });

    if (!userToDelete) {
      throw new Error('User not found');
    }

    const userQuestions = await prisma.question.findMany({
      where: {
        authorId: userToDelete?.id,
      },
      distinct: ['id'],
    });

    await prisma.question.deleteMany({
      where: {
        authorId: userToDelete?.id,
      },
    });

    const deletedUser = await prisma.user.delete({
      where: {
        clerkId,
      },
    });

    return deletedUser;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    await connectDatabase();

    const { searchQuery, filter, page = 1, pageSize = 20 } = params;

    const skipPages = (page - 1) * pageSize;

    const query: Prisma.UserWhereInput = {};
    if (searchQuery) {
      query.OR = [
        { name: { contains: searchQuery, mode: 'insensitive' } },
        { username: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case 'new_users':
        sortOptions = { joinedAt: 'desc' };
        break;
      case 'old_users':
        sortOptions = { joinedAt: 'asc' };
        break;
      case 'top_contributors':
        sortOptions = { reputation: 'desc' };
        break;
      default:
        sortOptions = { joinedAt: 'desc' };
    }

    const users = await prisma.user.findMany({
      where: query,
      skip: skipPages,
      take: pageSize,
      orderBy: sortOptions,
    });

    const userCount = await prisma.user.count({ where: query });

    const isNext = userCount > skipPages + users.length;

    return { users, isNext };
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      users: [],
      isNext: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function saveQuestion(params: ToggleSaveQuestionParams) {
  try {
    await connectDatabase();
    const { userId, questionId, path } = params;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        savedQuestions: true,
      },
    });

    if (!user) {
      throw new Error('No user found');
    }

    const isQuestionSaved = user.savedQuestions.some(
      (u: any) => u.id === questionId,
    );

    const data = {
      savedQuestions: isQuestionSaved
        ? {
            disconnect: { id: questionId },
          }
        : {
            connect: { id: questionId },
          },
    };

    await prisma.user.update({
      where: { id: userId },
      data,
    });

    revalidatePath(path);
  } catch (error) {
    console.error('Error in saveQuestion:', error);
    throw error;
  }
}

export async function getAllSavedQuestions(
  params: GetSavedQuestionsParams,
): Promise<SavedQuestionsResponse> {
  try {
    const { clerkId, searchQuery, filter, page = 1, pageSize = 20 } = params;

    const skipPages = (page - 1) * pageSize;

    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const searchFilter = searchQuery
      ? {
          title: {
            contains: searchQuery,
            mode: 'insensitive' as const,
          },
        }
      : {};

    let sortOptions = {};

    switch (filter) {
      case 'most_recent':
        sortOptions = { createdAt: 'desc' };
        break;
      case 'oldest':
        sortOptions = { createdAt: 'asc' };
        break;
      case 'most_viewed':
        sortOptions = { views: 'desc' };
        break;
      case 'most_voted':
        sortOptions = { upvotes: 'desc' };
        break;
      case 'most_answered':
        sortOptions = { answers: 'desc' };
        break;
    }

    const savedQuestions: QuestionWithDetails[] =
      await prisma.question.findMany({
        where: {
          savedBy: {
            some: { id: user.id },
          },
          ...searchFilter,
        },
        orderBy:
          Object.values(sortOptions).length > 0
            ? sortOptions
            : { createdAt: 'desc' },
        skip: skipPages,
        take: pageSize,
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
              picture: true,
              clerkId: true,
            },
          },

          _count: {
            select: {
              answers: true,
            },
          },
        },
      });

    const totalCount = await prisma.question.count({
      where: {
        savedBy: {
          some: { id: user.id },
        },
        ...searchFilter,
      },
    });

    const isNext = totalCount > skipPages + savedQuestions.length;

    return {
      savedQuestions,
      isNext,
    };
  } catch (error) {
    console.error('Error fetching questions:', error);
    return {
      savedQuestions: [],
      isNext: false,
    };
  }
}

export async function getUserInfo(params: GetUserStatsParams) {
  try {
    await connectDatabase();
    const { userId } = params;

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const totalQuestions = await prisma.question.count({
      where: {
        authorId: user.id,
      },
    });

    const totalAnswers = await prisma.answer.count({
      where: {
        authorId: user.id,
      },
    });

    const questionStats = await prisma.question.findMany({
      where: { authorId: user.id },
      select: {
        views: true,
        _count: {
          select: { upvotes: true },
        },
      },
    });

    const answerStats = await prisma.answer.findMany({
      where: { authorId: user.id },
      select: {
        _count: {
          select: { upvotes: true },
        },
      },
    });

    const questionUpvotes = questionStats.reduce(
      (acc, curr) => acc + curr._count.upvotes,
      0,
    );
    const questionViews = questionStats.reduce(
      (acc, curr) => acc + curr.views,
      0,
    );
    const answerUpvotes = answerStats.reduce(
      (acc, curr) => acc + curr._count.upvotes,
      0,
    );

    const badgeCounts = assignBadges({
      criteria: [
        { type: 'QUESTION_COUNT', count: totalQuestions },
        { type: 'ANSWER_COUNT', count: totalAnswers },
        { type: 'QUESTION_UPVOTES', count: questionUpvotes },
        { type: 'ANSWER_UPVOTES', count: answerUpvotes },
        { type: 'TOTAL_VIEWS', count: questionViews },
      ],
    });

    return {
      ...user,
      totalQuestions,
      totalAnswers,
      totalUpvotes: questionUpvotes + answerUpvotes,
      totalViews: questionViews,
      badgeCounts,
    };
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
}

export async function getAllUserQuestions(params: GetUserStatsParams) {
  try {
    await connectDatabase();

    let { userId } = params;
    const { page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;

    if (userId.startsWith('user_')) {
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
        select: { id: true },
      });
      if (user) {
        userId = user.id;
      } else {
        return { totalQuestions: 0, questions: [], isNext: false };
      }
    }

    const totalQuestions = await prisma.question.count({
      where: { authorId: userId },
    });

    const userQuestions = await prisma.question.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      skip: skipAmount,
      take: pageSize,
      include: {
        tags: true,
        author: true,
        upvotes: true,
        downvotes: true,
        _count: { select: { answers: true } },
      },
    });

    const isNext = totalQuestions > skipAmount + userQuestions.length;

    return {
      totalQuestions,
      questions: userQuestions,
      isNext,
    };
  } catch (error) {
    console.error('Error fetching user questions:', error);
    return {
      totalQuestions: 0,
      questions: [],
      isNext: false,
    };
  }
}

export async function getAllUserAnswers(params: GetUserStatsParams) {
  try {
    await connectDatabase();

    let { userId } = params;
    const { page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;

    if (userId.startsWith('user_')) {
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
        select: { id: true },
      });
      if (user) {
        userId = user.id;
      } else {
        return { answers: [], isNext: false };
      }
    }

    const totalAnswers = await prisma.answer.count({
      where: { authorId: userId },
    });

    const userAnswers = await prisma.answer.findMany({
      where: { authorId: userId },
      skip: skipAmount,
      take: pageSize,
      include: {
        question: { select: { id: true, title: true } },
        author: {
          select: { id: true, clerkId: true, name: true, picture: true },
        },
        upvotes: true,
        _count: { select: { upvotes: true } },
      },
      orderBy: { upvotes: { _count: 'desc' } },
    });

    const isNext = totalAnswers > skipAmount + userAnswers.length;

    return {
      answers: userAnswers,
      isNext,
    };
  } catch (error) {
    console.error('Error fetching user answers:', error);
    return {
      answers: [],
      isNext: false,
    };
  }
}