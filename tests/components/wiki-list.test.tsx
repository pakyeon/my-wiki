/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { WikiList } from "@/components/wiki-list";

afterEach(() => {
  cleanup();
});

describe("WikiList", () => {
  it("renders a knowledge-base section with linked pages and a featured reading entry", () => {
    render(
      <WikiList
        pages={[
          {
            slug: "cache-memory",
            title: "캐시 메모리",
            summary: "CPU와 메인 메모리 사이의 속도 차이를 줄이는 저장 계층입니다.",
            body: "본문",
            keywords: ["캐시", "메모리 계층"],
            sourceIds: [],
            links: ["memory-hierarchy"],
          },
          {
            slug: "locality",
            title: "지역성",
            summary: "캐시 성능을 설명하는 핵심 원리입니다.",
            body: "본문",
            keywords: ["지역성"],
            sourceIds: [],
            links: ["cache-memory"],
          },
        ]}
      />,
    );

    expect(screen.getByRole("heading", { name: "Knowledge base" })).toBeInTheDocument();
    expect(screen.getByText("Featured reading")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "캐시 메모리" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "지역성" })).toBeInTheDocument();
  });

  it("renders an empty state when no wiki pages exist yet", () => {
    render(<WikiList pages={[]} />);

    expect(screen.getByText("No wiki pages yet.")).toBeInTheDocument();
  });
});
