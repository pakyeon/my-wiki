import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { WikiPage } from "@/lib/types";

const DATA_ROOT = path.join(process.cwd(), "data");

function getDataDir() {
  const override = process.env.STUDY_WIKI_DATA_DIR?.trim();
  if (!override) {
    return DATA_ROOT;
  }
  if (path.isAbsolute(override)) {
    throw new Error("STUDY_WIKI_DATA_DIR must be a relative path under ./data");
  }

  const dataDir = path.join(DATA_ROOT, override);
  const relative = path.relative(DATA_ROOT, dataDir);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("STUDY_WIKI_DATA_DIR must stay within ./data");
  }

  return dataDir;
}

export async function ensureDataDirs() {
  const dataDir = getDataDir();
  await mkdir(path.join(dataDir, "uploads"), { recursive: true });
  await mkdir(path.join(dataDir, "wiki"), { recursive: true });
}

export async function saveWikiPages(pages: WikiPage[]) {
  if (pages.length === 0) {
    return;
  }
  await ensureDataDirs();
  const dataDir = getDataDir();
  const wikiDir = path.join(dataDir, "wiki");
  const opId = randomUUID();
  const stagingDir = path.join(dataDir, `wiki.tmp-${opId}`);
  const backupDir = path.join(dataDir, `wiki.backup-${opId}`);

  await mkdir(stagingDir, { recursive: true });
  try {
    await Promise.all(
      pages.map((page) =>
        writeFile(path.join(stagingDir, `${page.slug}.json`), JSON.stringify(page, null, 2), "utf8"),
      ),
    );
  } catch (error) {
    await rm(stagingDir, { recursive: true, force: true });
    throw error;
  }

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
      try {
        await rename(backupDir, wikiDir);
      } catch (rollbackError) {
        await rm(stagingDir, { recursive: true, force: true }).catch(() => {});
        throw new Error("Failed to restore wiki backup after save failure", {
          cause: rollbackError,
        });
      }
    }
    await rm(stagingDir, { recursive: true, force: true }).catch(() => {});
    throw error;
  }
}

export async function readWikiPage(slug: string) {
  const filePath = path.join(getDataDir(), "wiki", `${slug}.json`);
  if (!existsSync(filePath)) return null;
  try {
    return JSON.parse(await readFile(filePath, "utf8")) as WikiPage;
  } catch {
    return null;
  }
}

export async function listWikiPages() {
  await ensureDataDirs();
  const names = await readdir(path.join(getDataDir(), "wiki"));
  const jsonNames = names.filter((name) => name.endsWith(".json"));
  return Promise.all(jsonNames.map((name) => readWikiPage(name.replace(/\.json$/, "")))).then((pages) =>
    pages.filter((page): page is WikiPage => Boolean(page)),
  );
}
