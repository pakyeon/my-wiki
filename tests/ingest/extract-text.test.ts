import { describe, expect, it } from "vitest";
import { extractText, detectSourceKind } from "@/lib/ingest/extract-text";

describe("detectSourceKind", () => {
  it("detects assignment-like docs from filenames", () => {
    expect(
      detectSourceKind(
        "week3-assignment.docx",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ),
    ).toBe("assignment");
  });

  it("treats ordinary docx files as notes", () => {
    expect(
      detectSourceKind(
        "lecture-notes.docx",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ),
    ).toBe("note");
  });
});

describe("extractText", () => {
  it("reads plain text files", async () => {
    const file = new File([Buffer.from("Hello from text file")], "notes.txt", {
      type: "text/plain",
    });

    await expect(extractText(file)).resolves.toBe("Hello from text file");
  });

  it("rejects unsupported extensions", async () => {
    const file = new File([Buffer.from("binary")], "archive.zip", {
      type: "application/zip",
    });

    await expect(extractText(file)).rejects.toThrow("Unsupported file type: .zip");
  });
});
