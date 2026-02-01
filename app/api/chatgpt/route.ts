import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const POST = async (req: Request) => {
  const { question } = await req.json();
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are a helpful software engineer assistant on a platform like StackOverflow.
      Provide a clear, concise, and code-heavy answer to the following technical question.
      Format your response in Markdown.
      
      Question: ${question}
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};