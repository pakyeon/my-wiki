import { NextResponse } from "next/server";
import { listWikiPages } from "@/lib/storage/fs-store";
import { askWikiChat } from "@/lib/chat/wiki-chat";
import { rankWikiPages } from "@/lib/wiki/search-pages";

const INVALID_REQUEST_RESPONSE = { error: "question must be a string" };
const CHAT_BACKEND_ERROR_RESPONSE = {
  answer: "I could not complete the wiki chat right now. Please try again.",
  references: [],
};

function hasQuestionBody(body: unknown): body is { question: string } {
  return typeof body === "object" && body !== null && typeof (body as { question?: unknown }).question === "string";
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(INVALID_REQUEST_RESPONSE, { status: 400 });
  }

  if (!hasQuestionBody(body)) {
    return NextResponse.json(INVALID_REQUEST_RESPONSE, { status: 400 });
  }

  const { question } = body;

  try {
    const pages = await listWikiPages();
    const ranked = rankWikiPages(question, pages).slice(0, 3);

    if (ranked.length === 0) {
      return NextResponse.json({ answer: "I could not find relevant wiki pages for that question.", references: [] });
    }

    return NextResponse.json(await askWikiChat(question, ranked));
  } catch {
    return NextResponse.json(CHAT_BACKEND_ERROR_RESPONSE, { status: 503 });
  }
}
