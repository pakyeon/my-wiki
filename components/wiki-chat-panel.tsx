"use client";

import { useState } from "react";

export function WikiChatPanel() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [references, setReferences] = useState<{ slug: string; title: string }[]>([]);

  async function submit() {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await response.json();
    setAnswer(data.answer);
    setReferences(data.references ?? []);
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold">Wiki AI Chat</h2>
      <textarea
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        className="mt-4 min-h-28 w-full rounded-2xl border border-slate-300 p-3"
        placeholder="Ask from the generated wiki only."
      />
      <button onClick={submit} className="mt-3 rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white">
        Ask
      </button>
      {answer ? <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">{answer}</p> : null}
      {references.length > 0 ? (
        <ul className="mt-4 space-y-1 text-xs text-slate-500">
          {references.map((reference) => (
            <li key={reference.slug}>Source: {reference.title}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
