import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { WikiPage } from "@/lib/types";

const DATA_DIR = path.resolve(process.cwd(), process.env.STUDY_WIKI_DATA_DIR ?? "./data");

export async function ensureDataDirs() {
  await mkdir(path.join(DATA_DIR, "uploads"), { recursive: true });
  await mkdir(path.join(DATA_DIR, "wiki"), { recursive: true });
}

export async function saveWikiPages(pages: WikiPage[]) {
  await ensureDataDirs();
  await Promise.all(
    pages.map((page) =>
      writeFile(path.join(DATA_DIR, "wiki", `${page.slug}.json`), JSON.stringify(page, null, 2), "utf8"),
    ),
  );
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
