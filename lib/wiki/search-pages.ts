import type { WikiPage } from "@/lib/types";

export function rankWikiPages(question: string, pages: WikiPage[]) {
  const q = question.toLowerCase();

  return [...pages]
    .map((page) => ({
      page,
      score:
        page.keywords.filter((keyword) => q.includes(keyword.toLowerCase())).length +
        (q.includes(page.title.toLowerCase()) ? 2 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .filter((entry) => entry.score > 0)
    .map((entry) => entry.page);
}
