"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type WikiAiPanelScope = "global" | "page";

interface WikiShellContextValue {
  isPanelOpen: boolean;
  isAiPanelOpen: boolean;
  aiPanelScope: WikiAiPanelScope;
  currentSlug?: string;
  isSidebarOpen: boolean;
  openPanel: (input: { scope: WikiAiPanelScope; currentSlug?: string }) => void;
  openAiPanel: (input: { scope: WikiAiPanelScope; currentSlug?: string }) => void;
  closePanel: () => void;
  closeAiPanel: () => void;
  toggleAiPanel: (input?: { scope?: WikiAiPanelScope; currentSlug?: string }) => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

const WikiShellContext = createContext<WikiShellContextValue | null>(null);

export function WikiShellProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [aiPanelScope, setAiPanelScope] = useState<WikiAiPanelScope>("global");
  const [currentSlug, setCurrentSlug] = useState<string | undefined>(undefined);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const value = useMemo<WikiShellContextValue>(
    () => ({
      isPanelOpen: isAiPanelOpen,
      isAiPanelOpen,
      aiPanelScope,
      currentSlug,
      isSidebarOpen,
      openPanel(input) {
        setAiPanelScope(input.scope);
        setCurrentSlug(input.currentSlug);
        setIsAiPanelOpen(true);
      },
      openAiPanel(input) {
        setAiPanelScope(input.scope);
        setCurrentSlug(input.currentSlug);
        setIsAiPanelOpen(true);
      },
      closePanel() {
        setIsAiPanelOpen(false);
      },
      closeAiPanel() {
        setIsAiPanelOpen(false);
      },
      toggleAiPanel(input) {
        if (isAiPanelOpen) {
          setIsAiPanelOpen(false);
          return;
        }

        setAiPanelScope(input?.scope ?? "global");
        setCurrentSlug(input?.currentSlug);
        setIsAiPanelOpen(true);
      },
      openSidebar() {
        setIsSidebarOpen(true);
      },
      closeSidebar() {
        setIsSidebarOpen(false);
      },
      toggleSidebar() {
        setIsSidebarOpen((current) => !current);
      },
    }),
    [aiPanelScope, currentSlug, isAiPanelOpen, isSidebarOpen],
  );

  return <WikiShellContext.Provider value={value}>{children}</WikiShellContext.Provider>;
}

export function useWikiShell() {
  const context = useContext(WikiShellContext);
  if (!context) {
    throw new Error("useWikiShell must be used inside WikiShellProvider");
  }

  return context;
}
