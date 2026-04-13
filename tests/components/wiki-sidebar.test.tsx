/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { WikiSidebar } from "@/components/wiki-sidebar";
import { WikiShellProvider } from "@/components/wiki-shell-context";

afterEach(() => {
  cleanup();
});

describe("WikiSidebar", () => {
  it("renders the wiki search input and page links", () => {
    render(
      <WikiShellProvider>
        <WikiSidebar
          heading="My Wiki"
          pages={[
            {
              slug: "cache-memory",
              title: "캐시 메모리",
              summary: "요약",
              body: "본문",
              keywords: ["캐시", "메모리 계층"],
              sourceIds: [],
              links: ["memory-hierarchy"],
            },
          ]}
        />
      </WikiShellProvider>,
    );

    expect(screen.getByRole("searchbox", { name: "Search wiki" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "캐시 메모리" }).length).toBeGreaterThan(0);
    expect(screen.getByText("메모리 계층")).toBeInTheDocument();
  });
});
