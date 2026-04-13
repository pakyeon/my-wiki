import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { WikiShell } from "@/components/wiki-shell";
import { WikiShellProvider } from "@/components/wiki-shell-context";
import { listWikiPages } from "@/lib/storage/fs-store";
import "./globals.css";

export const metadata: Metadata = {
  title: "Study Wiki MVP",
  description:
    "Turn lecture notes, class PDFs, and assignment summaries into a linked study wiki.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  noStore();
  const pages = await listWikiPages().catch(() => []);

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[radial-gradient(circle_at_top,_rgba(241,245,249,0.95),_rgba(255,255,255,1)_38%),linear-gradient(180deg,_rgba(248,250,252,0.96),_rgba(255,255,255,1))] text-slate-950">
        <WikiShellProvider>
          <WikiShell pages={pages}>{children}</WikiShell>
        </WikiShellProvider>
      </body>
    </html>
  );
}
