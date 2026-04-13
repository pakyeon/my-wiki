import { afterEach, describe, expect, it, vi } from "vitest";

const { askWikiChat, listWikiPages, rankWikiPages } = vi.hoisted(() => ({
  askWikiChat: vi.fn(),
  listWikiPages: vi.fn(),
  rankWikiPages: vi.fn(),
}));

vi.mock("@/lib/storage/fs-store", () => ({
  listWikiPages,
}));

vi.mock("@/lib/wiki/search-pages", () => ({
  rankWikiPages,
}));

vi.mock("@/lib/chat/wiki-chat", () => ({
  askWikiChat,
}));

import { POST } from "@/app/api/chat/route";

afterEach(() => {
  vi.resetAllMocks();
});

describe("POST /api/chat", () => {
  it.each([
    ["missing question", {}],
    ["non-string question", { question: 42 }],
  ])("returns 400 for %s", async (_, body) => {
    const response = await POST(
      new Request("http://localhost/api/chat", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "question must be a string" });
    expect(listWikiPages).not.toHaveBeenCalled();
  });

  it("returns a safe fallback when the chat backend fails", async () => {
    const page = {
      slug: "cache",
      title: "Cache",
      summary: "",
      body: "",
      keywords: ["cache"],
      sourceIds: [],
      links: [],
    };

    listWikiPages.mockResolvedValue([page]);
    rankWikiPages.mockReturnValue([page]);
    askWikiChat.mockRejectedValue(new Error("backend unavailable"));

    const response = await POST(
      new Request("http://localhost/api/chat", {
        method: "POST",
        body: JSON.stringify({ question: "What is cache?" }),
      }),
    );

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      answer: "I could not complete the wiki chat right now. Please try again.",
      references: [],
    });
  });

  it("returns a no-match response when no pages rank", async () => {
    listWikiPages.mockResolvedValue([
      {
        slug: "cache",
        title: "Cache",
        summary: "",
        body: "",
        keywords: ["cache"],
        sourceIds: [],
        links: [],
      },
    ]);
    rankWikiPages.mockReturnValue([]);

    const response = await POST(
      new Request("http://localhost/api/chat", {
        method: "POST",
        body: JSON.stringify({ question: "What is recursion?" }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      answer: "I could not find relevant wiki pages for that question.",
      references: [],
    });
    expect(askWikiChat).not.toHaveBeenCalled();
  });
});
