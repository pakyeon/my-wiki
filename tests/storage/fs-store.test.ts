import { afterEach, describe, expect, it, vi } from "vitest";
import { existsSync } from "node:fs";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const createdDataDirs = new Set<string>();

async function makeTestDataDir() {
  const dataRoot = path.join(process.cwd(), "data");
  await mkdir(dataRoot, { recursive: true });
  const dataDir = await mkdtemp(path.join(dataRoot, "test-"));
  createdDataDirs.add(dataDir);
  return {
    dataDir,
    subdir: path.basename(dataDir),
  };
}

describe("saveWikiPages", () => {
  afterEach(async () => {
    vi.unstubAllEnvs();
    vi.resetModules();
    await Promise.all([...createdDataDirs].map((dataDir) => rm(dataDir, { recursive: true, force: true })));
    createdDataDirs.clear();
  });

  it("replaces stale wiki json files without touching uploads", async () => {
    const { dataDir, subdir } = await makeTestDataDir();
    await mkdir(path.join(dataDir, "wiki"), { recursive: true });
    await mkdir(path.join(dataDir, "uploads"), { recursive: true });

    await writeFile(path.join(dataDir, "wiki", "stale.json"), JSON.stringify({ stale: true }), "utf8");
    await writeFile(path.join(dataDir, "uploads", "keep.txt"), "keep", "utf8");

    vi.stubEnv("STUDY_WIKI_DATA_DIR", subdir);
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
    const { dataDir, subdir } = await makeTestDataDir();
    await mkdir(path.join(dataDir, "wiki"), { recursive: true });
    await writeFile(path.join(dataDir, "wiki", "stale.json"), JSON.stringify({ stale: true }), "utf8");

    vi.stubEnv("STUDY_WIKI_DATA_DIR", subdir);
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
    const { dataDir, subdir } = await makeTestDataDir();
    await mkdir(path.join(dataDir, "wiki"), { recursive: true });
    await writeFile(path.join(dataDir, "wiki", "stale.json"), JSON.stringify({ stale: true }), "utf8");

    vi.stubEnv("STUDY_WIKI_DATA_DIR", subdir);
    const { saveWikiPages } = await import("@/lib/storage/fs-store");

    await saveWikiPages([]);

    expect(existsSync(path.join(dataDir, "wiki", "stale.json"))).toBe(true);
  });

  it("rejects absolute storage overrides outside the data directory", async () => {
    vi.stubEnv("STUDY_WIKI_DATA_DIR", "/tmp/outside");
    const { ensureDataDirs } = await import("@/lib/storage/fs-store");

    await expect(ensureDataDirs()).rejects.toThrow("STUDY_WIKI_DATA_DIR must be a relative path under ./data");
  });
});

describe("listWikiPages", () => {
  afterEach(async () => {
    vi.unstubAllEnvs();
    vi.resetModules();
    await Promise.all([...createdDataDirs].map((dataDir) => rm(dataDir, { recursive: true, force: true })));
    createdDataDirs.clear();
  });

  it("skips malformed wiki json files", async () => {
    const { dataDir, subdir } = await makeTestDataDir();
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

    vi.stubEnv("STUDY_WIKI_DATA_DIR", subdir);
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
