import { NextResponse } from "next/server";
import { extractText } from "@/lib/ingest/extract-text";
import { normalizeSource } from "@/lib/ingest/normalize-source";
import { saveWikiPages } from "@/lib/storage/fs-store";
import { generateWikiPages } from "@/lib/wiki/generate-pages";

export async function POST(request: Request) {
  const form = await request.formData();
  const files = form.getAll("files").filter((value): value is File => value instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ pages: [] });
  }
  const sources = await Promise.all(
    files.map(async (file) =>
      normalizeSource({ fileName: file.name, mimeType: file.type, text: await extractText(file) }),
    ),
  );
  const pages = generateWikiPages(sources);
  await saveWikiPages(pages);
  return NextResponse.json({ pages });
}
