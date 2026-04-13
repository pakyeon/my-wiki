"use client";

import { type FormEvent, useState } from "react";
import { reloadWikiPage } from "@/components/upload-form-actions";

export function UploadForm() {
  const [status, setStatus] = useState("Idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const fileInput = event.currentTarget.elements.namedItem("files");
    const selectedFiles = fileInput instanceof HTMLInputElement ? Array.from(fileInput.files ?? []) : [];

    if (selectedFiles.length === 0) {
      setStatus("Select at least one file.");
      return;
    }

    setStatus("Generating wiki...");

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/ingest", { method: "POST", body: formData });
      if (!response.ok) {
        setStatus("Failed to generate wiki.");
        return;
      }

      const data = (await response.json()) as { pages?: unknown[] };
      if (!Array.isArray(data.pages) || data.pages.length === 0) {
        setStatus("No wiki pages were created.");
        return;
      }

      setStatus("Wiki generated.");
      reloadWikiPage();
    } catch {
      setStatus("Failed to generate wiki.");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-dashed border-slate-300 bg-white p-6"
    >
      <input
        name="files"
        type="file"
        multiple
        accept=".txt,.md,.pdf,.docx"
        className="block w-full text-sm"
      />
      <button className="mt-4 rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white">
        Build Wiki
      </button>
      <p className="mt-3 text-sm text-slate-500">{status}</p>
    </form>
  );
}
