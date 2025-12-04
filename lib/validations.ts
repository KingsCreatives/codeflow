import { z } from "zod";

export const QuestionsSchema = z.object({
  title: z.string().min(5),
  explanation: z.string().min(3),
  tags: z.array(z.string().min(1).max(15)).min(1).max(3)
});


export const AnswerSchema = z.object({
  answer: z.string().min(2)
})