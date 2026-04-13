import { describe, expect, it } from "vitest";
import { generateWikiPages } from "@/lib/wiki/generate-pages";

describe("generateWikiPages", () => {
  it("clusters mixed ingests by shared topic keywords", () => {
    const pages = generateWikiPages([
      {
        id: "cache-1",
        slug: "lecture-cache",
        title: "Lecture Cache",
        fileName: "lecture-cache.md",
        mimeType: "text/markdown",
        kind: "note",
        text: "Cache memory reduces latency in system design. Cache coherence matters for reliable system performance.",
      },
      {
        id: "cache-2",
        slug: "assignment-cache",
        title: "Assignment Cache",
        fileName: "assignment-cache.docx",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        kind: "assignment",
        text: "Cache eviction and system performance depend on write-back cache policies.",
      },
      {
        id: "auth-1",
        slug: "lecture-auth",
        title: "Lecture Auth",
        fileName: "lecture-auth.md",
        mimeType: "text/markdown",
        kind: "note",
        text: "Authentication tokens secure system access. Auth flows validate identity in system login.",
      },
      {
        id: "auth-2",
        slug: "assignment-auth",
        title: "Assignment Auth",
        fileName: "assignment-auth.docx",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        kind: "assignment",
        text: "Authentication sessions and system login use refresh tokens.",
      },
    ]);

    expect(pages).toHaveLength(2);
    expect(pages.map((page) => page.sourceIds)).toEqual([
      ["auth-1", "auth-2"],
      ["cache-1", "cache-2"],
    ]);
  });
});
