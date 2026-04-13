import Link from "next/link";
import type { WikiPage } from "@/lib/types";

export function WikiRelatedList({ pages }: Readonly<{ pages: WikiPage[] }>) {
  return (
    <section className="border-t border-slate-200 pt-8">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Connections</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">Linked concepts</h2>
        </div>
        <p className="text-sm text-slate-500">{pages.length} linked</p>
      </div>

      {pages.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-3">
          {pages.map((page) => (
            <Link
              key={page.slug}
              href={`/wiki/${page.slug}`}
              aria-label={page.title}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-[#fbfbfa]"
            >
              {page.title}
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-5 text-sm leading-6 text-slate-500">No related pages yet.</p>
      )}
    </section>
  );
}
