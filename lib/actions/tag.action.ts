"use server";

import { prisma } from "../db/client";
import { connectDatabase } from "../db/dbcheck";
import { GetAllTagsParams, GetTopInteractedTagsParams,GetQuestionsByTagIdParams , QuestionWithDetails} from "../shared.types";

export async function getUserFrequentTags(params: GetTopInteractedTagsParams) {
  try {
    await connectDatabase();
    const { userId, limit = 3 } = params;

   
    const user = prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new Error("User not found");

    return [
      { id: "1", name: "tag1" },
      { id: "2", name: "tag2" },
    ];
  } catch (error) {
    console.log(error);
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    await connectDatabase();
    const tags = await prisma.tag.findMany({
      orderBy: {
        id: "desc",
      },
      include: {
        questions: {
          select: {
            id: true,
          },
        },
      },
      take: params.pageSize || 100, 
    });

    return { tags };
  } catch (error) {
    console.log(error);
    return { tags: [] };
  }
}


export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    await connectDatabase();
    const { tagId, page = 1, pageSize = 10, searchQuery } = params;

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
              tags: {
                some: { id: tagId },
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
            tags: {
              some: { id: tagId },
            },
            ...searchFilter,
          },
        });

        const tagName = await prisma.tag.findUnique({
          where: { id: tagId },
          select: { name: true },
        })
    
        return {
          savedQuestions,
          totalCount,
          tagName: tagName ? tagName.name : "Unknown Tag",
        };

  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch questions by tag ID");
  }
}

export async function getPopularTags() {
  try {
    const popularTags = await prisma.tag.findMany({
      take: 5,
      orderBy: {
        questions: {
          _count: 'desc',
        },
      },
      include: {
        _count: {
          select: { questions: true },
        },
      },
    });

    return popularTags;
  } catch (error) {
    console.log(error);
    throw error;
  }
}