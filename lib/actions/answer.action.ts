"use server";

import { CreateAnswerParams, GetAnswersParams } from "../shared.types";
import { connectDatabase } from "../db/dbcheck";
import { prisma } from "@/lib/db/client";
import { revalidatePath } from "next/cache";
import path from "path";

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

    await prisma.question.update({
      where: { id: question },
      data: {
        answers: {
          connect: { id: answer.id },
        },
      },
    });

    // 

    revalidatePath(path);
    return { answer };
  } catch (error) {
    console.error("Error creating answer:", error);
    return {
      answer: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function getAllAnswers(params: GetAnswersParams){
  try {
    await connectDatabase();
    const { questionId } = params;
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
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { answers };
  } catch (error) {
    console.error("Error fetching answers:", error);
  }
}
