import Link from "next/link";
import type { WikiPage } from "@/lib/types";

export function WikiList({ pages }: { pages: WikiPage[] }) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {pages.map((page) => (
        <Link
          key={page.slug}
          href={`/wiki/${page.slug}`}
          className="rounded-2xl border border-slate-200 bg-white p-5"
        >
          <h2 className="text-xl font-semibold text-slate-900">{page.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{page.summary}</p>
        </Link>
      ))}
    </section>
  );
}
