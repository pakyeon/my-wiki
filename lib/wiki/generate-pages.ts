import slugify from "slugify";
import type { SourceRecord, WikiPage } from "@/lib/types";

const STOPWORDS = new Set([
  "about",
  "after",
  "and",
  "before",
  "compare",
  "describe",
  "explain",
  "from",
  "into",
  "latency",
  "memory",
  "throughput",
  "with",
]);

function normalizeWord(word: string) {
  return word.toLowerCase().replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, "");
}

function extractKeywordCandidates(text: string) {
  const matches = text.match(/[A-Za-z][A-Za-z-]{2,}/g) ?? [];
  const unique: string[] = [];

  for (const match of matches) {
    const word = normalizeWord(match);
    if (!word || STOPWORDS.has(word) || unique.includes(word)) continue;
    unique.push(word);
  }

  return unique;
}

function selectSharedKeyword(sources: SourceRecord[]) {
  const sourceKeywords = sources.map((source) => extractKeywordCandidates(source.text));
  const shared = sourceKeywords.reduce<Set<string> | null>((acc, keywords) => {
    const current = new Set(keywords);
    if (!acc) return current;
    return new Set([...acc].filter((keyword) => current.has(keyword)));
  }, null);

  if (shared && shared.size > 0) {
    return [...shared].sort((a, b) => a.localeCompare(b))[0];
  }

  const counts = new Map<string, number>();
  for (const keywords of sourceKeywords) {
    for (const keyword of keywords) {
      counts.set(keyword, (counts.get(keyword) ?? 0) + 1);
    }
  }

  const best = [...counts.entries()]
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0];

  return best?.[0] ?? sourceKeywords[0]?.[0] ?? "study-topic";
}

export function generateWikiPages(sources: SourceRecord[]): WikiPage[] {
  if (sources.length === 0) return [];

  const groups = new Map<string, SourceRecord[]>();
  const sharedKeyword = selectSharedKeyword(sources);

  for (const source of sources) {
    const sourceKeywords = extractKeywordCandidates(source.text);
    const key =
      sourceKeywords.includes(sharedKeyword) || sharedKeyword === "study-topic"
        ? sharedKeyword
        : sourceKeywords[0] ?? sharedKeyword;
    groups.set(key, [...(groups.get(key) ?? []), source]);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, grouped]) => ({
      slug: slugify(key, { lower: true, strict: true }),
      title: key.charAt(0).toUpperCase() + key.slice(1),
      summary: grouped.map((source) => source.text.split(".")[0]).join(". "),
      body: grouped.map((source) => `## ${source.title}\n\n${source.text}`).join("\n\n"),
      keywords: [key],
      sourceIds: grouped.map((source) => source.id),
      links: [],
    }));
}
