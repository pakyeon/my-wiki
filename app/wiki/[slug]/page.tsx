import { notFound } from "next/navigation";
import { WikiAiTrigger } from "@/components/wiki-ai-trigger";
import { WikiContent } from "@/components/wiki-content";
import { WikiRelatedList } from "@/components/wiki-related-list";
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
    <main className="mx-auto flex min-h-full w-full max-w-5xl flex-col gap-8 px-6 py-8 lg:px-10 lg:py-10">
      <article className="w-full border-b border-slate-200 pb-10">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              <span>Wiki</span>
              <span>/</span>
              <span>{page.slug}</span>
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">{page.title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">{page.summary}</p>

            {page.keywords.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {page.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full border border-slate-200 bg-[#fafafa] px-3 py-1 text-xs font-medium text-slate-600"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="w-full max-w-xs border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Ask from this page</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Open the side panel with this article as the active context, then expand into linked concepts only when needed.
            </p>
            <div className="mt-4">
              <WikiAiTrigger currentSlug={page.slug} scope="page" variant="open" />
            </div>
          </div>
        </div>

        <div className="mt-10">
          <WikiContent content={page.body} />
        </div>
      </article>

      <WikiRelatedList pages={relatedPages} />
    </main>
  );
}
