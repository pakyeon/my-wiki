import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import type { WikiPage } from "@/lib/types";

const SYSTEM_PROMPT =
  "You answer only from the provided wiki excerpts. Cite the referenced page titles. If the wiki does not contain the answer, say so clearly.";

export function buildGroundedMessages(question: string, pages: WikiPage[]): ChatCompletionMessageParam[] {
  const context = pages
    .map((page) => `# ${page.title}\n${page.body}`)
    .join("\n\n---\n\n");

  return [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: `Question: ${question}\n\nWiki Context:\n${context}` },
  ];
}
