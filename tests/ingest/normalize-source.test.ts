import { describe, expect, it } from "vitest";
import { normalizeSource } from "@/lib/ingest/normalize-source";

describe("normalizeSource", () => {
  it("maps notes, pdfs, and assignments into a shared source shape", () => {
    const source = normalizeSource({
      fileName: "lecture1-notes.md",
      mimeType: "text/markdown",
      text: "# Memory Hierarchy\nCaches reduce latency.",
    });

    expect(source.kind).toBe("note");
    expect(source.slug).toBe("lecture1-notes");
    expect(source.title).toBe("lecture1-notes");
    expect(source.text).toContain("Caches reduce latency.");
  });
});
