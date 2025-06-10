"use server";

import { prisma } from "../db/client";
import { connectDatabase } from "../db/dbcheck";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "../shared.types";
import { getUserById } from "./user.action";

export async function getUserFrequentTags(params: GetTopInteractedTagsParams) {
  try {
    await connectDatabase();
    const { userId, limit = 3 } = params;

    // const user = getUserById(userId);
    const user = prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new Error("User not found");

    return [
      { _id: "1", name: "tag1" },
      { _id: "2", name: "tag2" },
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
