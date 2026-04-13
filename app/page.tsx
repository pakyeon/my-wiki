import { UploadForm } from "@/components/upload-form";
import { WikiList } from "@/components/wiki-list";
import { listWikiPages } from "@/lib/storage/fs-store";

export default async function HomePage() {
  const pages = await listWikiPages();

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-10">
      <section className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
          Study Wiki MVP
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
          Turn scattered study materials into a linked learning wiki.
        </h1>
      </section>
      <UploadForm />
      <WikiList pages={pages} />
    </main>
  );
}
