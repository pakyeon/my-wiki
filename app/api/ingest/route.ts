import { NextResponse } from "next/server";
import { extractText } from "@/lib/ingest/extract-text";
import { normalizeSource } from "@/lib/ingest/normalize-source";
import { saveWikiPages } from "@/lib/storage/fs-store";
import { generateWikiPages } from "@/lib/wiki/generate-pages";
import { linkWikiPages } from "@/lib/wiki/link-pages";

export async function POST(request: Request) {
  const form = await request.formData();
  const files = form.getAll("files").filter((value): value is File => value instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ pages: [] });
  }
  const sourceResults = await Promise.allSettled(
    files.map(async (file) => {
      const text = await extractText(file);
      return normalizeSource({ fileName: file.name, mimeType: file.type, text });
    }),
  );
  const sources = sourceResults.flatMap((result) =>
    result.status === "fulfilled" ? [result.value] : [],
  );
  if (sources.length === 0) {
    return NextResponse.json({ pages: [] });
  }
  const pages = linkWikiPages(generateWikiPages(sources));
  await saveWikiPages(pages);
  return NextResponse.json({ pages });
}
