import { describe, expect, it } from "vitest";
import { linkWikiPages } from "@/lib/wiki/link-pages";

describe("linkWikiPages", () => {
  it("creates links between pages that share keywords", () => {
    const linked = linkWikiPages([
      { slug: "cache", title: "Cache", summary: "", body: "", keywords: ["cache", "memory"], sourceIds: ["a1"], links: [] },
      { slug: "memory", title: "Memory", summary: "", body: "", keywords: ["memory", "latency"], sourceIds: ["a2"], links: [] },
    ]);

    expect(linked[0]?.links).toContain("memory");
    expect(linked[1]?.links).toContain("cache");
  });

  it("does not link a page to itself or unrelated pages", () => {
    const linked = linkWikiPages([
      { slug: "cache", title: "Cache", summary: "", body: "", keywords: ["cache"], sourceIds: ["a1"], links: [] },
      { slug: "sorting", title: "Sorting", summary: "", body: "", keywords: ["sorting"], sourceIds: ["a2"], links: [] },
    ]);

    expect(linked[0]?.links).toEqual([]);
    expect(linked[1]?.links).toEqual([]);
  });
});
