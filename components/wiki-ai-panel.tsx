"use client";

import type { WikiPage } from "@/lib/types";
import { WikiAiTrigger } from "@/components/wiki-ai-trigger";
import { WikiChatPanel } from "@/components/wiki-chat-panel";
import { useWikiShell } from "@/components/wiki-shell-context";

interface WikiAiPanelProps {
  mode?: "desktop" | "mobile";
  pages?: WikiPage[];
}

function getContextLabel(pages: WikiPage[], currentSlug?: string, scope?: "global" | "page") {
  if (scope !== "page" || !currentSlug) {
    return "the full wiki";
  }

  const activePage = pages.find((page) => page.slug === currentSlug);
  return activePage ? activePage.title : "the current page";
}

export function WikiAiPanel({ mode = "desktop", pages = [] }: Readonly<WikiAiPanelProps>) {
  const { isAiPanelOpen, aiPanelScope, currentSlug, closeAiPanel } = useWikiShell();
  const contextLabel = getContextLabel(pages, currentSlug, aiPanelScope);
  const isMobile = mode === "mobile";

  if (isMobile && !isAiPanelOpen) {
    return null;
  }

  const panelBody = (
    <div className="flex h-full min-h-0 flex-col border-slate-200 bg-[#f7f7f5]">
      <div className="border-b border-slate-200 bg-white px-3 py-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Ask AI</p>
            <h2 className="mt-2 text-lg font-semibold tracking-tight text-slate-950">Grounded assistant</h2>
            <p className="mt-1.5 text-[13px] leading-5 text-slate-600">
              Ground answers in the wiki pages you are browsing.
            </p>
          </div>
          <WikiAiTrigger variant={isAiPanelOpen ? "close" : "open"} label="Ask AI" />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        {isAiPanelOpen ? (
          <WikiChatPanel contextLabel={contextLabel} />
        ) : (
          <div className="rounded-md border border-dashed border-slate-300 bg-white p-6">
            <p className="text-sm leading-6 text-slate-600">
              Open Ask AI to keep a grounded chat panel next to the wiki.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 lg:hidden" aria-label="Ask AI mobile panel">
        <button
          type="button"
          aria-label="Close Ask AI overlay"
          className="absolute inset-0 bg-slate-950/30"
          onClick={closeAiPanel}
        />
        <aside className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-2xl">
          {panelBody}
        </aside>
      </div>
    );
  }

  return <aside className="flex h-full min-h-0 flex-col">{panelBody}</aside>;
}
