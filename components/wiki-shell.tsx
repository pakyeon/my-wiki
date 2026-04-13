"use client";

import type { ReactNode } from "react";
import type { WikiPage } from "@/lib/types";
import { WikiAiTrigger } from "@/components/wiki-ai-trigger";
import { WikiAiPanel } from "@/components/wiki-ai-panel";
import { useWikiShell } from "@/components/wiki-shell-context";
import { WikiSidebar } from "@/components/wiki-sidebar";

interface WikiShellProps {
  pages: WikiPage[];
  children: ReactNode;
}

export function WikiShell({ pages, children }: Readonly<WikiShellProps>) {
  const { closeSidebar, isSidebarOpen, toggleSidebar } = useWikiShell();

  return (
    <div className="min-h-screen bg-[#fbfbfa]">
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-[#fbfbfa]/95 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={toggleSidebar}
          className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900"
        >
          Browse wiki
        </button>
        <p className="text-sm font-semibold tracking-tight text-slate-800">My Wiki</p>
        <WikiAiTrigger variant="open" />
      </div>

      <div className="grid min-h-[calc(100vh-61px)] grid-cols-1 lg:min-h-screen lg:grid-cols-[248px_minmax(0,1fr)_352px] lg:grid-rows-[minmax(0,1fr)]">
        <section className="order-1 min-w-0 lg:order-none lg:col-start-2 lg:row-start-1">{children}</section>
        <aside className="hidden border-r border-slate-200 bg-white lg:sticky lg:top-0 lg:order-none lg:col-start-1 lg:row-start-1 lg:block lg:h-screen lg:overflow-y-auto">
          <WikiSidebar pages={pages} />
        </aside>
        <aside className="hidden border-l border-slate-200 bg-[#f7f7f5] lg:sticky lg:top-0 lg:order-none lg:col-start-3 lg:row-start-1 lg:block lg:h-screen lg:overflow-y-auto">
          <WikiAiPanel pages={pages} />
        </aside>
      </div>

      {isSidebarOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close wiki navigation"
            className="absolute inset-0 bg-slate-950/30"
            onClick={closeSidebar}
          />
          <aside className="absolute inset-y-0 left-0 w-full max-w-xs overflow-y-auto border-r border-slate-200 bg-white shadow-2xl">
            <WikiSidebar pages={pages} onNavigate={closeSidebar} />
          </aside>
        </div>
      ) : null}

      <WikiAiPanel mode="mobile" pages={pages} />
    </div>
  );
}
