import OpenAI from "openai";
import { buildGroundedMessages } from "@/lib/chat/prompt";
import type { WikiPage } from "@/lib/types";

export async function askWikiChat(question: string, pages: WikiPage[]) {
  const client = new OpenAI({
    baseURL: process.env.CHAT_MODEL_BASE_URL,
    apiKey: process.env.CHAT_MODEL_API_KEY ?? "local",
  });

  const response = await client.chat.completions.create({
    model: process.env.CHAT_MODEL_NAME ?? "gemma-4-e4b-it-q4",
    messages: buildGroundedMessages(question, pages),
    temperature: 0.2,
  });

  return {
    answer: response.choices[0]?.message?.content ?? "I could not produce an answer from the wiki.",
    references: pages.map((page) => ({ slug: page.slug, title: page.title })),
  };
}
