"use server"

import {connectDatabase} from "../db/dbcheck"
import { prisma } from "@/lib/db/client";

export async function createQuestion(params:any) {

    try {
        await connectDatabase()
        const {title, content, tags, author, path} = params
      

        const normalizedTags = tags.map((tag: string) =>
          tag.trim().toLowerCase()
        );

        const tagDocuments = [];

        
    for (const tag of normalizedTags) {
      // Look for existing tag (case-insensitive)
      const existingTag = await prisma.tag.findFirst({
        where: {
          name: {
            equals: tag,
            mode: "insensitive", // case-insensitive match
          },
        },
      });

      let tagRecord;

      if (existingTag) {
        tagRecord = existingTag;
      } else {
        // Create new tag if not found
        tagRecord = await prisma.tag.create({
          data: {
            name: tag,
          },
        });
      }

      tagDocuments.push({ id: tagRecord.id });
    }

    const question = await prisma.question.create({
      data: {
        title,
        content,
        author: {
          connect: {
            id: author,
          },
        },
        tags: {
          connect: tagDocuments,
        },
      },
      include: {
        tags: true,
      },
    });

    return question;
  } catch (error) {
    throw error;
  }
}