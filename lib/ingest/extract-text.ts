import path from "node:path";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

export function detectSourceKind(fileName: string, mimeType: string) {
  const ext = path.extname(fileName).toLowerCase();
  const lowerName = fileName.toLowerCase();

  if (mimeType === "application/pdf" || ext === ".pdf") return "pdf" as const;
  if (lowerName.includes("assignment") || lowerName.includes("summary") || ext === ".docx") {
    return "assignment" as const;
  }
  return "note" as const;
}

export async function extractText(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name).toLowerCase();

  if (ext === ".txt" || ext === ".md") {
    return buffer.toString("utf8");
  }

  if (ext === ".pdf") {
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      return result.text;
    } finally {
      await parser.destroy();
    }
  }

  if (ext === ".docx") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw new Error(`Unsupported file type: ${ext}`);
}
