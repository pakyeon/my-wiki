import { describe, expect, it } from "vitest";
import { buildGroundedMessages } from "@/lib/chat/prompt";

describe("buildGroundedMessages", () => {
  it("injects wiki sources into the user prompt", () => {
    const messages = buildGroundedMessages("Explain cache coherence", [
      { slug: "cache", title: "Cache", summary: "Cache basics", body: "## Cache\nCache coherence keeps copies aligned.", keywords: ["cache"], sourceIds: [], links: [] },
    ]);

    expect(messages.at(-1)?.content).toContain("Cache coherence keeps copies aligned.");
  });

  it("truncates long wiki bodies before placing them in the prompt", () => {
    const longBody = `Intro ${"a".repeat(4000)} UNIQUE_TAIL_MARKER`;
    const messages = buildGroundedMessages("Explain cache coherence", [
      { slug: "cache", title: "Cache", summary: "Cache basics", body: longBody, keywords: ["cache"], sourceIds: [], links: [] },
    ]);

    const content = String(messages.at(-1)?.content ?? "");

    expect(content).toContain("Intro ");
    expect(content).not.toContain("UNIQUE_TAIL_MARKER");
    expect(content.length).toBeLessThan(longBody.length);
  });
});
