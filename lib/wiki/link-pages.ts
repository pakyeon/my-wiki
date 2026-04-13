import type { WikiPage } from "@/lib/types";

export function linkWikiPages(pages: WikiPage[]) {
  return pages.map((page) => {
    const related = pages
      .filter((candidate) => candidate.slug !== page.slug)
      .filter((candidate) => candidate.keywords.some((keyword) => page.keywords.includes(keyword)))
      .map((candidate) => candidate.slug);

    return { ...page, links: related };
  });
}
