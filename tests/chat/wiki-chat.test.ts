import { describe, expect, it } from "vitest";
import { buildGroundedMessages } from "@/lib/chat/prompt";

describe("buildGroundedMessages", () => {
  it("injects wiki sources into the user prompt", () => {
    const messages = buildGroundedMessages("Explain cache coherence", [
      { slug: "cache", title: "Cache", summary: "Cache basics", body: "## Cache\nCache coherence keeps copies aligned.", keywords: ["cache"], sourceIds: [], links: [] },
    ]);

    expect(messages.at(-1)?.content).toContain("Cache coherence keeps copies aligned.");
  });
});
