/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { WikiContent } from "@/components/wiki-content";

afterEach(() => {
  cleanup();
});

describe("WikiContent", () => {
  it("renders markdown content with an on-this-page table of contents", () => {
    render(
      <WikiContent
        title="캐시 메모리"
        content={`## 메모리 계층\n\n캐시 메모리는 CPU와 주기억장치 사이의 속도 차이를 줄입니다.\n\n### 지역성\n\n- temporal locality\n- spatial locality`}
      />,
    );

    expect(screen.getByRole("heading", { name: "캐시 메모리" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "메모리 계층" })).toBeInTheDocument();
    expect(screen.getByText("temporal locality")).toBeInTheDocument();
    expect(screen.getByText("On this page")).toBeInTheDocument();
  });
});
