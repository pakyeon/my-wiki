import { NextResponse } from "next/server";
import { listWikiPages } from "@/lib/storage/fs-store";
import { askWikiChat } from "@/lib/chat/wiki-chat";
import { rankWikiPages } from "@/lib/wiki/search-pages";

export async function POST(request: Request) {
  const { question } = await request.json();
  const pages = await listWikiPages();
  const ranked = rankWikiPages(question, pages).slice(0, 3);

  if (ranked.length === 0) {
    return NextResponse.json({ answer: "I could not find relevant wiki pages for that question.", references: [] });
  }

  return NextResponse.json(await askWikiChat(question, ranked));
}
