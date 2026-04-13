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
});
