"use server";
import { connectDatabase } from '@/lib/db/dbcheck';
import { prisma } from '@/lib/db/client';
import { ViewQuestionParams } from '../shared.types';

export async function trackQuestionViews(
  params: ViewQuestionParams
): Promise<void> {
  try {
    await connectDatabase();

    const { userId, questionId } = params;

    // Check if this user has already viewed the question
    const existingInteraction = await prisma.interaction.findFirst({
      where: {
        userId: userId ?? undefined,
        questionId,
        action: 'view',
      },
    });

    if (!existingInteraction) {
      await prisma.interaction.create({
        data: {
          userId : userId || "",
          questionId,
          action: 'view',
        },
      });

      
      await prisma.question.update({
        where: { id: questionId },
        data: {
          views: { increment: 1 },
        },
      });
    }
  } catch (error) {
    console.error('Error tracking question views:', error);
    throw new Error('Failed to track question views');
  }
}