'use server';

import { connectDatabase } from '../db/dbcheck';
import { prisma } from '@/lib/db/client';
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from '../shared.types';
import { revalidatePath } from 'next/cache';
import { QuestionWithDetails, SavedQuestionsResponse } from '../shared.types';
import { sortByUpvotesAndViews } from '../utils';

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
    if(!data.username){
    throw new Error("Username is required")
    }
    const newUser = await prisma.user.create({
      data,
    });
    return newUser;
  } catch (error) {
    console.log(error);
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
    console.log(error);
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

    // Find all questions created by the userToDelete
    const userQuestions = await prisma.question.findMany({
      where: {
        authorId: userToDelete?.id,
      },
      distinct: ['id'],
    });

    // Delete all questions created by the userToDelete
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
    const { page = 1, pageSize = 20, filter, searchQuery } = params;

    const users = await prisma.user.findMany({});
    return { users };
  } catch (error) {
    console.log(error);
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
      (u) => u.id === questionId
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
  params: GetSavedQuestionsParams
): Promise<SavedQuestionsResponse> {
  try {
    const { clerkId, searchQuery, page = 1, pageSize = 10 } = params;

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

    const savedQuestions: QuestionWithDetails[] =
      await prisma.question.findMany({
        where: {
          savedBy: {
            some: { id: user.id },
          },
          ...searchFilter,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
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

    return {
      savedQuestions,
      totalCount,
    };
  } catch (error) {
    console.error('Error in getAllSavedQuestions:', error);
    return { savedQuestions: [], totalCount: 0 };
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

    return {
      ...user,
      totalQuestions,
      totalAnswers,
    };
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
}

export async function getAllUserQuestions(params: GetUserStatsParams) {
  try {
    await connectDatabase();
    const { userId, page=1, pageSize=10} = params;

    const totalQuestions = await prisma.question.count({
      where: {
        author: { id: userId },
      },
    });

    const userQuestions = await prisma.question.findMany({
      where: {
        author: { id: userId },
      },
      include: {
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
        upvotes: { select: { id: true } }, 
        downvotes: { select: { id: true } }, 
        author: {
          select: {
            id: true,
            clerkId: true,
            name: true,
            picture: true,
          },
        },
        _count: {
          select: {
            answers: true,
            upvotes: true,
          },
        },
      },
    });

    const sortedQuestions = sortByUpvotesAndViews(userQuestions);

    return {
      questions: sortedQuestions,
      totalQuestions,
    };
    
  } catch (error) {
    console.error('Error fetching user questions:', error);
    throw error;
  }
}


export async function getAllUserAnswers(params: GetUserStatsParams) {
  try {
    await connectDatabase();
    const { userId, page = 1, pageSize = 10 } = params;

    const totalAnswers = await prisma.answer.count({
      where: {
        author: { id: userId },
      },
    });

    const userAnswers = await prisma.answer.findMany({
      where: {
        author: { id: userId },
      },
      include: {
        author: {
          select: {
            id: true,
            clerkId: true,
            name: true,
            picture: true,
          },
        },
        question: {
          select: {
            id: true,
            title: true,
          },
        },
        upvotes: true,
      },
    });

    const sortedAnswer = sortByUpvotesAndViews(userAnswers)

    return {
      answers: sortedAnswer,
      totalAnswers,
    };
  } catch (error) {
    console.error('Error fetching user Answers:', error);
    throw error;
  }
}