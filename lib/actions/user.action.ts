"use server";

import { connectDatabase } from "../db/dbcheck";
import { prisma } from "@/lib/db/client";
import {
  CreateUserParams,
  DeleteUserParams,
  UpdateUserParams,
} from "../shared.types";
import { revalidatePath } from "next/cache";

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
    return updateUser
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
      throw new Error("User not found");
    }

    // Find all questions created by the userToDelete
    const userQuestions = await prisma.question.findMany({
      where: {
        authorId: userToDelete?.id,
      },
      distinct: ["id"],
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
