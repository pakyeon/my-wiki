import { describe, expect, it } from "vitest";
import { generateWikiPages } from "@/lib/wiki/generate-pages";

describe("generateWikiPages", () => {
  it("groups related study materials into topic pages", () => {
    const pages = generateWikiPages([
      {
        id: "a1",
        slug: "lecture-cache",
        title: "Lecture Cache",
        fileName: "lecture-cache.md",
        mimeType: "text/markdown",
        kind: "note",
        text: "Cache memory reduces latency and improves throughput.",
      },
      {
        id: "a2",
        slug: "assignment-cache",
        title: "Assignment Cache",
        fileName: "assignment-cache.docx",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        kind: "assignment",
        text: "Explain cache coherence and compare write-through with write-back.",
      },
    ]);

    expect(pages[0]?.title).toContain("Cache");
    expect(pages[0]?.sourceIds).toEqual(["a1", "a2"]);
  });
});
