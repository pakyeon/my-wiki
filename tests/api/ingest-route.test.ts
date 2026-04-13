import { afterEach, describe, expect, it, vi } from "vitest";

const { saveWikiPages, extractText, normalizeSource, generateWikiPages, linkWikiPages } = vi.hoisted(() => ({
  saveWikiPages: vi.fn(),
  extractText: vi.fn(),
  normalizeSource: vi.fn(),
  generateWikiPages: vi.fn(),
  linkWikiPages: vi.fn(),
}));

vi.mock("@/lib/ingest/extract-text", () => ({
  extractText,
}));

vi.mock("@/lib/ingest/normalize-source", () => ({
  normalizeSource,
}));

vi.mock("@/lib/storage/fs-store", () => ({
  saveWikiPages,
}));

vi.mock("@/lib/wiki/generate-pages", () => ({
  generateWikiPages,
}));

vi.mock("@/lib/wiki/link-pages", () => ({
  linkWikiPages,
}));

import { POST } from "@/app/api/ingest/route";

describe("POST /api/ingest", () => {
  afterEach(() => {
    saveWikiPages.mockReset();
    extractText.mockReset();
    normalizeSource.mockReset();
    generateWikiPages.mockReset();
    linkWikiPages.mockReset();
  });

  it("skips persistence when the request has no valid files", async () => {
    const formData = new FormData();

    const response = await POST(
      new Request("http://localhost/api/ingest", {
        method: "POST",
        body: formData,
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ pages: [] });
    expect(saveWikiPages).not.toHaveBeenCalled();
  });

  it("continues ingest when one uploaded file fails to extract", async () => {
    const goodFile = new File(["good"], "good.md", { type: "text/markdown" });
    const badFile = new File(["bad"], "bad.pdf", { type: "application/pdf" });
    const formData = new FormData();
    formData.append("files", goodFile);
    formData.append("files", badFile);

    extractText.mockImplementation(async (file: File) => {
      if (file.name === "bad.pdf") {
        throw new Error("bad file");
      }
      return "good text";
    });
    normalizeSource.mockReturnValue({
      id: "source-1",
      slug: "good",
      title: "good",
      fileName: "good.md",
      mimeType: "text/markdown",
      kind: "note",
      text: "good text",
    });
    generateWikiPages.mockReturnValue([
      {
        slug: "cache",
        title: "Cache",
        summary: "summary",
        body: "body",
        keywords: ["cache"],
        sourceIds: ["source-1"],
        links: [],
      },
    ]);
    linkWikiPages.mockImplementation((pages) => pages);

    const response = await POST(
      new Request("http://localhost/api/ingest", {
        method: "POST",
        body: formData,
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      pages: [
        {
          slug: "cache",
          title: "Cache",
          summary: "summary",
          body: "body",
          keywords: ["cache"],
          sourceIds: ["source-1"],
          links: [],
        },
      ],
    });
    expect(generateWikiPages).toHaveBeenCalledWith([
      {
        id: "source-1",
        slug: "good",
        title: "good",
        fileName: "good.md",
        mimeType: "text/markdown",
        kind: "note",
        text: "good text",
      },
    ]);
    expect(saveWikiPages).toHaveBeenCalledTimes(1);
  });
});
