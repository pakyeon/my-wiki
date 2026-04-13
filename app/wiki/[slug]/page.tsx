import Link from "next/link";
import { notFound } from "next/navigation";
import { listWikiPages, readWikiPage } from "@/lib/storage/fs-store";

export default async function WikiDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await readWikiPage(slug);
  if (!page) {
    notFound();
  }
  const allPages = await listWikiPages();
  const relatedPages = page.links
    .map((link) => allPages.find((candidate) => candidate.slug === link))
    .filter((candidate): candidate is NonNullable<typeof candidate> => Boolean(candidate));

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10">
      <article className="rounded-3xl border border-slate-200 bg-white p-8">
        <h1 className="text-3xl font-semibold">{page.title}</h1>
        <p className="mt-4 whitespace-pre-wrap text-slate-700">{page.body}</p>
      </article>
      <section>
        <h2 className="text-lg font-semibold">Related Pages</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {relatedPages.length > 0 ? (
            relatedPages.map((relatedPage) => (
              <Link
                key={relatedPage.slug}
                href={`/wiki/${relatedPage.slug}`}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm"
              >
                {relatedPage.title}
              </Link>
            ))
          ) : (
            <p className="text-sm text-slate-500">No related pages yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
