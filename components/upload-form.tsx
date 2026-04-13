"use client";

import { type FormEvent, useState } from "react";
import { reloadWikiPage } from "@/components/upload-form-actions";

export function UploadForm({ compact = false }: Readonly<{ compact?: boolean }>) {
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
      className={[
        "border border-dashed border-slate-300 bg-white",
        compact ? "rounded-2xl p-4" : "rounded-3xl p-6",
      ].join(" ")}
    >
      <input
        name="files"
        type="file"
        multiple
        accept=".txt,.md,.pdf,.docx"
        className="block w-full text-sm text-slate-700"
      />
      <button
        className={[
          "rounded-full bg-slate-900 text-sm font-medium text-white",
          compact ? "mt-3 px-4 py-2" : "mt-4 px-5 py-2",
        ].join(" ")}
      >
        Build Wiki
      </button>
      <p className="mt-3 text-sm text-slate-500">{status}</p>
    </form>
  );
}
