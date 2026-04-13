/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as uploadFormModule from "@/components/upload-form";
import * as uploadFormActions from "@/components/upload-form-actions";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("UploadForm", () => {
  it("shows a no-op message when submitted without files", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const reloadMock = vi.spyOn(uploadFormActions, "reloadWikiPage").mockImplementation(() => {});

    const { container } = render(<uploadFormModule.UploadForm />);
    const form = container.querySelector("form");
    expect(form).not.toBeNull();

    fireEvent.submit(form as HTMLFormElement);

    await screen.findByText("Select at least one file.");
    expect(fetchMock).not.toHaveBeenCalled();
    expect(reloadMock).not.toHaveBeenCalled();
  });

  it("does not reload when the ingest endpoint returns no pages", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ pages: [] }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const reloadMock = vi.spyOn(uploadFormActions, "reloadWikiPage").mockImplementation(() => {});

    const { container } = render(<uploadFormModule.UploadForm />);
    const input = container.querySelector('input[type="file"]');
    const form = container.querySelector("form");
    expect(input).not.toBeNull();
    expect(form).not.toBeNull();

    const file = new File(["hello"], "notes.txt", { type: "text/plain" });
    fireEvent.change(input as HTMLInputElement, { target: { files: [file] } });
    fireEvent.submit(form as HTMLFormElement);

    await screen.findByText("No wiki pages were created.");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(reloadMock).not.toHaveBeenCalled();
  });

  it("reloads after a successful ingest response", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ pages: [{ slug: "cache" }] }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const reloadMock = vi.spyOn(uploadFormActions, "reloadWikiPage").mockImplementation(() => {});

    const { container } = render(<uploadFormModule.UploadForm />);
    const input = container.querySelector('input[type="file"]');
    const form = container.querySelector("form");
    expect(input).not.toBeNull();
    expect(form).not.toBeNull();

    const file = new File(["hello"], "notes.txt", { type: "text/plain" });
    fireEvent.change(input as HTMLInputElement, { target: { files: [file] } });
    fireEvent.submit(form as HTMLFormElement);

    await screen.findByText("Wiki generated.");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(reloadMock).toHaveBeenCalledTimes(1);
  });
});
