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

function selectTopicKeyword(keywords: string[], keywordCounts: Map<string, number>) {
  return (
    keywords
      .filter((keyword) => (keywordCounts.get(keyword) ?? 0) > 1)
      .sort((a, b) => (keywordCounts.get(a) ?? 0) - (keywordCounts.get(b) ?? 0) || a.localeCompare(b))[0] ??
    keywords[0] ??
    "study-topic"
  );
}

export function generateWikiPages(sources: SourceRecord[]): WikiPage[] {
  if (sources.length === 0) return [];

  const groups = new Map<string, SourceRecord[]>();
  const keywordCounts = new Map<string, number>();
  const sourceKeywords = sources.map((source) => extractKeywordCandidates(source.text));

  for (const keywords of sourceKeywords) {
    for (const keyword of keywords) {
      keywordCounts.set(keyword, (keywordCounts.get(keyword) ?? 0) + 1);
    }
  }

  for (let index = 0; index < sources.length; index += 1) {
    const source = sources[index];
    const keywords = sourceKeywords[index] ?? [];
    const key = selectTopicKeyword(keywords, keywordCounts);
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
