import { listWikiPages } from "@/lib/storage/fs-store";
import { WikiList } from "@/components/wiki-list";

export default async function HomePage() {
  const pages = await listWikiPages();

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-10">
      <section className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
          Study Wiki MVP
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
          Turn lecture notes, class PDFs, and assignment summaries into a linked study wiki.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-slate-600">
          Reorganize scattered study records into topic pages, connected concepts,
          and wiki-grounded chat for faster review before exams and assignments.
        </p>
      </section>
      <WikiList pages={pages} />
    </main>
  );
}
