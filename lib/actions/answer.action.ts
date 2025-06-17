"use server";

import { CreateAnswerParams } from "../shared.types";
import { connectDatabase } from "../db/dbcheck";
import { prisma } from "@/lib/db/client";
import { revalidatePath } from "next/cache";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    await connectDatabase();
    const { content, question, author } = params;
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

    revalidatePath(`/questions/${question}`);
    return { answer };
  } catch (error) {
    console.log("Database connection error:", error);
    throw new Error("Database connection failed");
  }
}
