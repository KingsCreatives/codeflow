'use server';

import { connectDatabase } from '../db/dbcheck';
import { SearchParams } from '../shared.types';
import { prisma } from '../db/client';
import { SearchableTypes } from '@/constants';

export async function globalSearch(params: SearchParams) {
  try {
    await connectDatabase();

    const { query, type } = params;
    const regexQuery = { contains: query, mode: 'insensitive' as const };

    const modelsAndTypes = [
      { model: prisma.question, searchField: 'title', type: 'question' },
      { model: prisma.user, searchField: 'name', type: 'user' },
      { model: prisma.answer, searchField: 'content', type: 'answer' },
      { model: prisma.tag, searchField: 'name', type: 'tag' },
    ];

    const typeLower = type?.toLowerCase();
    let results = [];

    const mapResults = (items: any[], type: string) => {
      return items.map((item) => ({
        title:
          type === 'answer'
            ? `Answer containing "${query}"`
            : item[modelInfo(type).searchField],
        type,
        id: type === 'user' ? item.clerkId : item.id,
        url:
          type === 'user'
            ? `/profile/${item.clerkId}`
            : type === 'tag'
              ? `/tags/${item.id}`
              : `/question/${item.id}`,
      }));
    };

    const modelInfo = (type: string) =>
      modelsAndTypes.find((m) => m.type === type)!;

    if (!typeLower || !SearchableTypes.includes(typeLower)) {
      
      const searchPromises = modelsAndTypes.map(async (item) => {
        // @ts-ignore 
        const queryResults = await item.model.findMany({
          where: { [item.searchField]: regexQuery },
          take: 2,
        });

        return mapResults(queryResults, item.type);
      });

      const data = await Promise.all(searchPromises);
      results = data.flat();
    } else {
      
      const model = modelInfo(typeLower);
      if (!model) throw new Error('Invalid search type');

      // @ts-ignore
      const queryResults = await model.model.findMany({
        where: { [model.searchField]: regexQuery },
        take: 8,
      });

      results = mapResults(queryResults, typeLower);
    }

    return JSON.stringify(results);
  } catch (error) {
    console.error(`Error fetching global results, ${error}`);
    throw error;
  }
}
