'use server';

import { connectDatabase } from '../db/dbcheck';
import { prisma } from '@/lib/db/client';
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from '../shared.types';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { disconnect } from 'process';

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

export async function createdUser(data: CreateUserParams) {
  try {
    await connectDatabase();
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

    const updatedUser = await prisma.user.update({
      where: {
        clerkId,
      },
      data: {
        ...updateData,
      },
    });
    revalidatePath(path);
    return updateUser;
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

    revalidatePath(path)
  } catch (error) {
    console.error('Error in saveQuestion:', error);
    throw error;
  }
}
