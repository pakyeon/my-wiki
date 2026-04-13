/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { WikiRelatedList } from "@/components/wiki-related-list";

afterEach(() => {
  cleanup();
});

describe("WikiRelatedList", () => {
  it("renders a linked concepts section for related pages", () => {
    render(
      <WikiRelatedList
        pages={[
          {
            slug: "locality",
            title: "지역성",
            summary: "캐시 성능을 설명하는 핵심 원리입니다.",
            body: "본문",
            keywords: ["지역성"],
            sourceIds: [],
            links: [],
          },
        ]}
      />,
    );

    expect(screen.getByRole("heading", { name: "Linked concepts" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "지역성" })).toBeInTheDocument();
  });

  it("renders an empty state when there are no related pages", () => {
    render(<WikiRelatedList pages={[]} />);

    expect(screen.getByText("No related pages yet.")).toBeInTheDocument();
  });
});
