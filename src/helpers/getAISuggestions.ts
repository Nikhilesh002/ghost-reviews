import { GoogleGenerativeAI } from "@google/generative-ai";


export async function getAISuggestions(context:string){
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
  const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL ?? "" });

  const prompt = `Contest is - ${context}. Think out of the box and generate 3 unique and diverse open-ended questions or feedbacks for an anonymous social review and messaging platform. Each point should be distinct from the others, encouraging different types of positive and engaging conversations with suitable emojis. Use ' || ' to separate. From these, select 3 varied questions.Do not number the questions and never include an outro or intro or '\n' character. Keep the total response under 300 characters.`
  const result = await model.generateContent(prompt);

  const aiRes = result.response.text();

  return aiRes;
}