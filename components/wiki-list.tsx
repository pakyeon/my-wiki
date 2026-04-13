import Link from "next/link";
import type { WikiPage } from "@/lib/types";

export function WikiList({ pages }: { pages: WikiPage[] }) {
  const [featuredPage, ...remainingPages] = pages;

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Wiki</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Knowledge base</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Browse the generated study pages as a connected knowledge base instead of a file folder.
          </p>
        </div>
        <p className="text-sm text-slate-500">{pages.length} linked pages</p>
      </div>

      {featuredPage ? (
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.8fr)]">
          <div className="border-y border-slate-200 bg-white">
            <Link href={`/wiki/${featuredPage.slug}`} aria-label={featuredPage.title} className="block px-1 py-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Featured reading</p>
              <h3 className="mt-3 text-[2rem] font-semibold tracking-tight text-slate-950">{featuredPage.title}</h3>
              <p className="mt-4 max-w-2xl text-[15px] leading-8 text-slate-600">{featuredPage.summary}</p>
              {featuredPage.keywords.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {featuredPage.keywords.slice(0, 4).map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full border border-slate-200 bg-[#fbfbfa] px-3 py-1 text-xs font-medium text-slate-600"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              ) : null}
            </Link>
          </div>

          <div className="border-t border-slate-200">
            <div className="border-b border-slate-200 px-1 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Recent pages</p>
            </div>
            <div>
              {remainingPages.map((page) => (
                <Link
                  key={page.slug}
                  href={`/wiki/${page.slug}`}
                  aria-label={page.title}
                  className="block border-b border-slate-200 px-1 py-4 transition hover:bg-white/80"
                >
                  <h3 className="text-base font-semibold text-slate-900">{page.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{page.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-slate-300 bg-white px-6 py-10">
          <h3 className="text-lg font-semibold text-slate-950">No wiki pages yet.</h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
            Upload class notes, lecture PDFs, or assignment summaries to generate the first connected wiki pages.
          </p>
        </div>
      )}
    </section>
  );
}
