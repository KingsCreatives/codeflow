'use server';

import { connectDatabase } from '../db/dbcheck';
import { SearchParams } from '../shared.types';
import { prisma } from '../db/client';
import { SearchableTypes } from '@/constants';

export async function globalSearch(params: SearchParams) {
  try {
    await connectDatabase();

    const { query, type } = params;
    const regexQuery = {contains: query, mode: 'insensitive' as const}

  const modelsAndTypes = [
      { model: prisma.question, searchField: 'title', type: 'question' },
      { model: prisma.user, searchField: 'name', type: 'user' },
      { model: prisma.answer, searchField: 'content', type: 'answer' },
      { model: prisma.tag, searchField: 'name', type: 'tag' },
    ];

    const typeToLower = type?.toLowerCase();

    let results = []

    if (!typeToLower || !SearchableTypes.includes(typeToLower) ) {

       const searchPromises = modelsAndTypes.map(async (item) => {
         // @ts-ignore 
         const queryResults = await item.model.findMany({
           where: {
             [item.searchField]: regexQuery,
           },
           take: 2, 
         });

         return queryResults.map((obj: any) => ({
           title:
             item.type === 'answer'
               ? `Answer containing "${query}"`
               : obj[item.searchField],
           type: item.type,
           id: item.type === 'user' ? obj.clerkId : obj.id, 
         }));
       });

       results = (await Promise.all(searchPromises)).flat();
    } else {
      const modelInfo = modelsAndTypes.find((m) => m.type === typeToLower);

      if (!modelInfo) {
        throw new Error('Invalid search type');
      }

      // @ts-ignore
      const queryResults = await modelInfo.model.findMany({
        where: { [modelInfo.searchField]: regexQuery },
        take: 8,
      });

      results = queryResults.map((obj: any) => ({
        title:
          typeToLower === 'answer'
            ? `Answer containing "${query}"`
            : obj[modelInfo.searchField],
        type: typeToLower,
        id: typeToLower === 'user' ? obj.clerkId : obj.id,
      }));
    }

    return JSON.stringify(results);
   
  } catch (error) {
    console.log(`Error fetching global results, ${error}`);
    throw error;
  }
}
