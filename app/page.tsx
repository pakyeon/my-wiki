import { UploadForm } from "@/components/upload-form";
import { WikiList } from "@/components/wiki-list";
import { listWikiPages } from "@/lib/storage/fs-store";

export default async function HomePage() {
  const pages = await listWikiPages();
  const keywordCount = new Set(pages.flatMap((page) => page.keywords)).size;

  return (
    <main className="mx-auto flex min-h-full w-full max-w-5xl flex-col gap-8 px-6 py-8 lg:px-10 lg:py-10">
      <section className="border-b border-slate-200 pb-8">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">My Wiki</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">A study wiki that reads like a knowledge base.</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Compile lecture notes, PDFs, and assignment summaries into linked pages you can actually browse,
              revisit, and question from one persistent wiki.
            </p>
          </div>

          <div className="w-full max-w-sm space-y-4">
            <div className="border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Refresh wiki</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Upload new study materials as a utility action without leaving the reading flow.
              </p>
              <div className="mt-4">
                <UploadForm compact />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Pages</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{pages.length}</p>
              </div>
              <div className="border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Topics</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{keywordCount}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_260px]">
        <WikiList pages={pages} />
        <aside className="border-t border-slate-200 pt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Reading flow</p>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">Start from a page, then follow the links.</h2>
          <div className="mt-4 space-y-4 text-sm leading-6 text-slate-600">
            <p>Browse the wiki from the left rail, open a page in the center, and keep Ask AI on the side when you need clarification.</p>
            <p>The goal is not to manage files. It is to keep concepts connected enough to read them like a maintained personal wiki.</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
