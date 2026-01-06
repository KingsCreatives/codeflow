import { z } from 'zod';

export const QuestionsSchema = z.object({
  title: z.string().min(5),
  explanation: z.string().min(3),
  tags: z.array(z.string().min(1).max(15)).min(1).max(3),
});

export const AnswerSchema = z.object({
  answer: z.string().min(2),
});

export const ProfileSchema = z.object({
  name: z.string().min(2),
  username: z.string().min(2),

  portfolioWebsite: z.string().url().optional().or(z.literal('')),

  location: z.string().optional().or(z.literal('')),

  bio: z
    .string()
    .min(10, 'String must contain at least 10 characters')
    .optional()
    .or(z.literal('')),
});

