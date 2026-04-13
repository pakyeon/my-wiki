import { createHash } from "node:crypto";
import slugify from "slugify";
import { detectSourceKind } from "@/lib/ingest/extract-text";
import type { SourceRecord } from "@/lib/types";

export function normalizeSource(input: {
  fileName: string;
  mimeType: string;
  text: string;
}): SourceRecord {
  const baseName = input.fileName.replace(/\.[^.]+$/, "");

  return {
    id: createHash("sha1").update(`${input.fileName}:${input.text}`).digest("hex").slice(0, 12),
    slug: slugify(baseName, { lower: true, strict: true }),
    title: baseName,
    fileName: input.fileName,
    mimeType: input.mimeType,
    kind: detectSourceKind(input.fileName, input.mimeType),
    text: input.text.trim(),
  };
}
