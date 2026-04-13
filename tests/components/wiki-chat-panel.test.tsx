/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { WikiChatPanel } from "@/components/wiki-chat-panel";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("WikiChatPanel", () => {
  it("shows an error when asked with an empty question", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(<WikiChatPanel />);

    fireEvent.click(screen.getByRole("button", { name: /ask/i }));

    await screen.findByText("Enter a question first.");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows an error when the chat endpoint returns a non-ok response", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "nope" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<WikiChatPanel />);

    fireEvent.change(screen.getByPlaceholderText(/ask from the generated wiki only/i), {
      target: { value: "What is cache?" },
    });
    fireEvent.click(screen.getByRole("button", { name: /ask/i }));

    await screen.findByText("Failed to answer the question.");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("shows an error when the chat request rejects", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("network down"));
    vi.stubGlobal("fetch", fetchMock);

    render(<WikiChatPanel />);

    fireEvent.change(screen.getByPlaceholderText(/ask from the generated wiki only/i), {
      target: { value: "What is cache?" },
    });
    fireEvent.click(screen.getByRole("button", { name: /ask/i }));

    await screen.findByText("Failed to answer the question.");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
