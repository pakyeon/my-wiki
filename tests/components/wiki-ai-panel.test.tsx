/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { WikiAiPanel } from "@/components/wiki-ai-panel";
import { WikiAiTrigger } from "@/components/wiki-ai-trigger";
import { WikiShellProvider } from "@/components/wiki-shell-context";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("WikiAiPanel", () => {
  it("opens the panel from the shared trigger and shows the global scope label", () => {
    vi.stubGlobal("fetch", vi.fn());

    render(
      <WikiShellProvider>
        <WikiAiTrigger />
        <WikiAiPanel />
      </WikiShellProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Ask AI" }));

    expect(screen.getAllByText("Ask AI")).not.toHaveLength(0);
    expect(screen.getByText("Using the full wiki as context")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Close Ask AI" }).length).toBeGreaterThan(0);
  });
});
