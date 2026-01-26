'use server';

import { prisma } from '../db/client';
import { Prisma } from '@prisma/client';
import { connectDatabase } from '../db/dbcheck';
import {
  GetAllTagsParams,
  GetTopInteractedTagsParams,
  GetQuestionsByTagIdParams,
  QuestionWithDetails,
} from '../shared.types';
import { saveQuestion } from './user.action';

export async function getUserFrequentTags(params: GetTopInteractedTagsParams) {
  try {
    await connectDatabase();
    const { userId, limit = 3 } = params;

    const user = prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new Error('User not found');

    return [
      { id: '1', name: 'tag1' },
      { id: '2', name: 'tag2' },
    ];
  } catch (error) {
    console.log(error);
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    await connectDatabase();

    const { searchQuery, filter, page = 1, pageSize = 20 } = params;

    const skipPages = (page - 1) * pageSize;

    let sortOptions = {};

    switch (filter) {
      case 'recent':
        sortOptions = { createdAt: 'desc' };
        break;
      case 'popular':
        sortOptions = { questions: 'desc' };
        break;
      case 'name':
        sortOptions = { name: 'desc' };
        break;
      case 'old':
        sortOptions = { createdAt: 'asc' };
        break;
    }

    const query: Prisma.TagWhereInput = {};

    if (searchQuery) {
      query.OR = [{ name: { contains: searchQuery, mode: 'insensitive' } }];
    }

    const tags = await prisma.tag.findMany({
      where: query,
      orderBy: Object.values(sortOptions).length > 0 ? sortOptions : '   ',
      include: {
        questions: {
          select: {
            id: true,
          },
        },
      },
      take: pageSize,
      skip: skipPages,
    });

    const totalTags = await prisma.tag.count({
      where: query,
    });

    const isNext = totalTags > skipPages + tags.length;

    return { tags, isNext };
  } catch (error) {
    console.error('Error fetching questions:', error);
    return {
      questions: [],
      isNext: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    await connectDatabase();
    const { tagId, page = 1, pageSize = 10, searchQuery } = params;

    const skipPages = (page - 1) * pageSize;

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
        tags: {
          some: { id: tagId },
        },
        ...searchFilter,
      },
    });

    const tagName = await prisma.tag.findUnique({
      where: { id: tagId },
      select: { name: true },
    });

    const isNext = totalCount > savedQuestions.length + pageSize;

    return {
      savedQuestions,
      tagName: tagName ? tagName.name : 'Unknown Tag',
      isNext,
    };
  } catch (error) {
    console.error('Error fetching questions:', error);
    return {
      savedQuestions: [],
      isNext: false,
      error: error instanceof Error ? error.message : String(error),
    };
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
