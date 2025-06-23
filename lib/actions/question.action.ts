"use server";

import { connectDatabase } from "../db/dbcheck";
import { prisma } from "@/lib/db/client";
import {
  CreateQuestionParams,
  GetQuestionsParams,
  GetQuestionByIdParams,
} from "../shared.types";
import { revalidatePath } from "next/cache";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    await connectDatabase();

    const questions = await prisma.question.findMany({
      take: 10,
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
          },
        },
        _count: {
          select: {
            answers: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { questions };
  } catch (error) {
    console.error("Error fetching questions:", error);
    return {
      questions: [],
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
            mode: "insensitive",
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
      // include: {
      //   tags: true,
      //   author: {
      //     select: {
      //       id: true,
      //       name: true,
      //       username: true,
      //       picture: true,
      //     },
      //   },
      // },
    });

    revalidatePath(path);
    return { question };
  } catch (error) {
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
            savedQuestions: true
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
    console.error("Error fetching question:", error);
    return {
      question: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
