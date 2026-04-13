import { describe, expect, it } from "vitest";
import { rankWikiPages } from "@/lib/wiki/search-pages";

describe("rankWikiPages", () => {
  it("prefers pages whose title and keywords overlap with the question", () => {
    const ranked = rankWikiPages("How does cache memory reduce latency?", [
      { slug: "cache", title: "Cache", summary: "", body: "", keywords: ["cache", "memory", "latency"], sourceIds: [], links: [] },
      { slug: "sorting", title: "Sorting", summary: "", body: "", keywords: ["sorting"], sourceIds: [], links: [] },
    ]);

    expect(ranked[0]?.slug).toBe("cache");
  });
});
