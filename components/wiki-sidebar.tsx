"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import type { WikiPage } from "@/lib/types";
import { WikiSidebarSearch } from "@/components/wiki-sidebar-search";
import { WikiAiTrigger } from "@/components/wiki-ai-trigger";

interface WikiSidebarProps {
  heading?: string;
  pages: WikiPage[];
  currentSlug?: string;
  onNavigate?: () => void;
}

function normalize(value: string) {
  return value.toLowerCase().trim();
}

export function WikiSidebar({ heading = "My Wiki", pages, currentSlug, onNavigate }: Readonly<WikiSidebarProps>) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const activeSlug = currentSlug ?? (pathname?.startsWith("/wiki/") ? pathname.replace("/wiki/", "") : undefined);

  const filteredPages = useMemo(() => {
    const normalizedQuery = normalize(query);
    if (!normalizedQuery) {
      return pages;
    }

    return pages.filter((page) => {
      const haystack = [page.title, page.summary, page.body, ...page.keywords].join(" ").toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [pages, query]);

  const topics = useMemo(() => {
    const seen = new Set<string>();
    for (const page of pages) {
      for (const keyword of page.keywords) {
        if (!seen.has(keyword)) {
          seen.add(keyword);
        }
      }
    }
    return Array.from(seen).slice(0, 8);
  }, [pages]);

  const recentPages = useMemo(() => pages.slice(0, 4), [pages]);

  return (
    <aside className="flex h-full min-h-0 flex-col border-slate-200 bg-white">
      <div className="space-y-4 border-b border-slate-200 px-3 py-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Study Wiki</p>
          <h1 className="mt-1 text-base font-semibold tracking-tight text-slate-950">{heading}</h1>
          <p className="mt-1.5 text-[13px] leading-5 text-slate-600">Linked notes, PDFs, and assignments in one reading flow.</p>
        </div>
        <WikiSidebarSearch value={query} onChange={setQuery} />
        <div className="flex items-center gap-2">
          <WikiAiTrigger className="flex-1 justify-center border-slate-200 bg-slate-950 text-xs text-white hover:bg-slate-800" />
          <Link
            href="/"
            onClick={onNavigate}
            className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Hub
          </Link>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Topics</h2>
            <span className="text-xs text-slate-500">{topics.length}</span>
          </div>
          <div className="flex flex-wrap gap-2 px-1">
            {topics.length > 0 ? (
              topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700"
                >
                  {topic}
                </span>
              ))
            ) : (
              <p className="px-1 text-sm text-slate-500">No topics yet.</p>
            )}
          </div>
        </section>

        <section className="mt-6 min-h-0 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Wiki</h2>
            <span className="text-xs text-slate-500">{filteredPages.length}</span>
          </div>
          <nav aria-label="Wiki pages" className="space-y-1">
            {filteredPages.length > 0 ? (
              filteredPages.map((page) => {
                const isCurrent = activeSlug === page.slug;

                return (
                  <Link
                    key={page.slug}
                    href={`/wiki/${page.slug}`}
                    aria-label={page.title}
                    onClick={onNavigate}
                    className={[
                      "block rounded-md px-3 py-2 transition",
                      isCurrent ? "bg-slate-950 text-white" : "text-slate-700 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-medium">{page.title}</h3>
                        <p className={["mt-1 line-clamp-2 text-xs leading-5", isCurrent ? "text-slate-200" : "text-slate-500"].join(" ")}>
                          {page.summary}
                        </p>
                      </div>
                      {isCurrent ? <span className="pt-0.5 text-[10px] uppercase tracking-[0.22em]">Now</span> : null}
                    </div>
                  </Link>
                );
              })
            ) : (
              <p className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-5 text-sm text-slate-500">
                No wiki pages match the current search.
              </p>
            )}
          </nav>
        </section>

        <section className="mt-6 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Recent</h2>
          </div>
          <div className="space-y-1">
            {recentPages.length > 0 ? (
              recentPages.map((page) => (
                <Link
                  key={`recent-${page.slug}`}
                  href={`/wiki/${page.slug}`}
                  onClick={onNavigate}
                  className="block rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-white hover:text-slate-900"
                >
                  {page.title}
                </Link>
              ))
            ) : (
              <p className="px-1 text-sm text-slate-500">No recent pages yet.</p>
            )}
          </div>
        </section>
      </div>
    </aside>
  );
}
