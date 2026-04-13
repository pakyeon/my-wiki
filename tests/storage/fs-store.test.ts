import { afterEach, describe, expect, it, vi } from "vitest";
import { existsSync } from "node:fs";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

describe("saveWikiPages", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("replaces stale wiki json files without touching uploads", async () => {
    const dataDir = await mkdtemp(path.join(os.tmpdir(), "llm-wiki-"));
    await mkdir(path.join(dataDir, "wiki"), { recursive: true });
    await mkdir(path.join(dataDir, "uploads"), { recursive: true });

    await writeFile(path.join(dataDir, "wiki", "stale.json"), JSON.stringify({ stale: true }), "utf8");
    await writeFile(path.join(dataDir, "uploads", "keep.txt"), "keep", "utf8");

    vi.stubEnv("STUDY_WIKI_DATA_DIR", dataDir);
    const { saveWikiPages } = await import("@/lib/storage/fs-store");

    await saveWikiPages([
      {
        slug: "fresh-page",
        title: "Fresh Page",
        summary: "Fresh summary",
        body: "Fresh body",
        keywords: ["fresh"],
        sourceIds: ["source-1"],
        links: [],
      },
    ]);

    await expect(readFile(path.join(dataDir, "wiki", "fresh-page.json"), "utf8")).resolves.toContain("Fresh Page");
    await expect(readFile(path.join(dataDir, "uploads", "keep.txt"), "utf8")).resolves.toBe("keep");
    expect(existsSync(path.join(dataDir, "wiki", "stale.json"))).toBe(false);
  });

  it("keeps stale wiki files if a later page write fails", async () => {
    const dataDir = await mkdtemp(path.join(os.tmpdir(), "llm-wiki-"));
    await mkdir(path.join(dataDir, "wiki"), { recursive: true });
    await writeFile(path.join(dataDir, "wiki", "stale.json"), JSON.stringify({ stale: true }), "utf8");

    vi.stubEnv("STUDY_WIKI_DATA_DIR", dataDir);
    const { saveWikiPages } = await import("@/lib/storage/fs-store");

    await expect(
      saveWikiPages([
        {
          slug: "fresh-page",
          title: "Fresh Page",
          summary: "Fresh summary",
          body: "Fresh body",
          keywords: ["fresh"],
          sourceIds: ["source-1"],
          links: [],
        },
        {
          slug: "nested/fail",
          title: "Broken Page",
          summary: "Broken summary",
          body: "Broken body",
          keywords: ["broken"],
          sourceIds: ["source-2"],
          links: [],
        },
      ]),
    ).rejects.toThrow();

    expect(existsSync(path.join(dataDir, "wiki", "stale.json"))).toBe(true);
    expect(existsSync(path.join(dataDir, "wiki", "fresh-page.json"))).toBe(false);
  });

  it("does not delete existing wiki files when called with no pages", async () => {
    const dataDir = await mkdtemp(path.join(os.tmpdir(), "llm-wiki-"));
    await mkdir(path.join(dataDir, "wiki"), { recursive: true });
    await writeFile(path.join(dataDir, "wiki", "stale.json"), JSON.stringify({ stale: true }), "utf8");

    vi.stubEnv("STUDY_WIKI_DATA_DIR", dataDir);
    const { saveWikiPages } = await import("@/lib/storage/fs-store");

    await saveWikiPages([]);

    expect(existsSync(path.join(dataDir, "wiki", "stale.json"))).toBe(true);
  });
});

describe("listWikiPages", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("skips malformed wiki json files", async () => {
    const dataDir = await mkdtemp(path.join(os.tmpdir(), "llm-wiki-"));
    await mkdir(path.join(dataDir, "wiki"), { recursive: true });
    await writeFile(
      path.join(dataDir, "wiki", "valid.json"),
      JSON.stringify({
        slug: "valid",
        title: "Valid",
        summary: "summary",
        body: "body",
        keywords: ["valid"],
        sourceIds: ["source-1"],
        links: [],
      }),
      "utf8",
    );
    await writeFile(path.join(dataDir, "wiki", "broken.json"), "{not-json", "utf8");

    vi.stubEnv("STUDY_WIKI_DATA_DIR", dataDir);
    const { listWikiPages, readWikiPage } = await import("@/lib/storage/fs-store");

    await expect(readWikiPage("broken")).resolves.toBeNull();
    await expect(listWikiPages()).resolves.toEqual([
      {
        slug: "valid",
        title: "Valid",
        summary: "summary",
        body: "body",
        keywords: ["valid"],
        sourceIds: ["source-1"],
        links: [],
      },
    ]);
  });
});
