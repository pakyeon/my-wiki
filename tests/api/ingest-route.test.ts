import { afterEach, describe, expect, it, vi } from "vitest";

const { saveWikiPages } = vi.hoisted(() => ({
  saveWikiPages: vi.fn(),
}));

vi.mock("@/lib/storage/fs-store", () => ({
  saveWikiPages,
}));

import { POST } from "@/app/api/ingest/route";

describe("POST /api/ingest", () => {
  afterEach(() => {
    saveWikiPages.mockReset();
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
});
