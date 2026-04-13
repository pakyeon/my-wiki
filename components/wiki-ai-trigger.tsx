"use client";

import type { ButtonHTMLAttributes } from "react";
import { useWikiShell, type WikiAiPanelScope } from "@/components/wiki-shell-context";

interface WikiAiTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onClick"> {
  currentSlug?: string;
  label?: string;
  variant?: "default" | "open" | "close";
  scope?: WikiAiPanelScope;
}

export function WikiAiTrigger({
  currentSlug,
  label = "Ask AI",
  variant = "default",
  className = "",
  scope,
  ...props
}: Readonly<WikiAiTriggerProps>) {
  const { isAiPanelOpen, openAiPanel, closeAiPanel } = useWikiShell();
  const resolvedScope = scope ?? (currentSlug ? "page" : "global");

  const actionLabel =
    variant === "open"
      ? `Open ${label}`
      : variant === "close"
        ? `Close ${label}`
        : isAiPanelOpen
          ? `Close ${label}`
          : label;

  return (
    <button
      {...props}
      type="button"
      onClick={() => {
        if (variant === "close") {
          closeAiPanel();
          return;
        }

        if (variant === "open") {
          openAiPanel({ scope: resolvedScope, currentSlug });
          return;
        }

        if (isAiPanelOpen) {
          closeAiPanel();
          return;
        }

        openAiPanel({ scope: resolvedScope, currentSlug });
      }}
      className={[
        "inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition",
        "border-slate-300 bg-white text-slate-900 hover:border-slate-400 hover:bg-slate-50",
        className,
      ].join(" ")}
    >
      {actionLabel}
    </button>
  );
}
