import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { WikiPage } from "@/lib/types";

const DATA_DIR = path.resolve(process.cwd(), process.env.STUDY_WIKI_DATA_DIR ?? "./data");

export async function ensureDataDirs() {
  await mkdir(path.join(DATA_DIR, "uploads"), { recursive: true });
  await mkdir(path.join(DATA_DIR, "wiki"), { recursive: true });
}

export async function saveWikiPages(pages: WikiPage[]) {
  if (pages.length === 0) {
    return;
  }
  await ensureDataDirs();
  const wikiDir = path.join(DATA_DIR, "wiki");
  const stagingDir = path.join(DATA_DIR, `wiki.tmp-${process.pid}-${Date.now()}`);
  const backupDir = path.join(DATA_DIR, `wiki.backup-${process.pid}-${Date.now()}`);

  await mkdir(stagingDir, { recursive: true });
  await Promise.all(
    pages.map((page) =>
      writeFile(path.join(stagingDir, `${page.slug}.json`), JSON.stringify(page, null, 2), "utf8"),
    ),
  );

  try {
    if (existsSync(wikiDir)) {
      await rename(wikiDir, backupDir);
    }
    await rename(stagingDir, wikiDir);
    if (existsSync(backupDir)) {
      await rm(backupDir, { recursive: true, force: true });
    }
  } catch (error) {
    if (existsSync(backupDir) && !existsSync(wikiDir)) {
      await rename(backupDir, wikiDir).catch(() => {});
    }
    await rm(stagingDir, { recursive: true, force: true }).catch(() => {});
    throw error;
  }
}

export async function readWikiPage(slug: string) {
  const filePath = path.join(DATA_DIR, "wiki", `${slug}.json`);
  if (!existsSync(filePath)) return null;
  return JSON.parse(await readFile(filePath, "utf8")) as WikiPage;
}

export async function listWikiPages() {
  await ensureDataDirs();
  const names = await readdir(path.join(DATA_DIR, "wiki"));
  const jsonNames = names.filter((name) => name.endsWith(".json"));
  return Promise.all(jsonNames.map((name) => readWikiPage(name.replace(/\.json$/, "")))).then((pages) =>
    pages.filter((page): page is WikiPage => Boolean(page)),
  );
}
