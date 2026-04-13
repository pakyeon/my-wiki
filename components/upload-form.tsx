"use client";

import { useState } from "react";

export function UploadForm() {
  const [status, setStatus] = useState("Idle");

  async function onSubmit(formData: FormData) {
    setStatus("Generating wiki...");
    const response = await fetch("/api/ingest", { method: "POST", body: formData });
    if (!response.ok) {
      setStatus("Failed to generate wiki.");
      return;
    }
    setStatus("Wiki generated.");
    window.location.reload();
  }

  return (
    <form
      action={onSubmit}
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
