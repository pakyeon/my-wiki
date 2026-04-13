"use client";

import { useState } from "react";

interface WikiChatPanelProps {
  contextLabel?: string;
}

export function WikiChatPanel({ contextLabel = "the full wiki" }: Readonly<WikiChatPanelProps>) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [references, setReferences] = useState<{ slug: string; title: string }[]>([]);
  const [error, setError] = useState("");

  async function submit() {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      setError("Enter a question first.");
      return;
    }

    setError("");
    setAnswer("");
    setReferences([]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmedQuestion }),
      });

      if (!response.ok) {
        setError("Failed to answer the question.");
        return;
      }

      const data = await response.json();
      setAnswer(data.answer);
      setReferences(data.references ?? []);
    } catch {
      setError("Failed to answer the question.");
    }
  }

  return (
    <section className="flex min-h-0 flex-col rounded-md border border-slate-200 bg-white p-5">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-950">Wiki AI Chat</h2>
        <p className="text-sm leading-6 text-slate-500">Using {contextLabel} as context</p>
      </div>
      <textarea
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        className="mt-4 min-h-28 w-full rounded-md border border-slate-300 p-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
        placeholder="Ask from the generated wiki only."
      />
      <button onClick={submit} className="mt-3 inline-flex w-fit rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white">
        Ask
      </button>
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
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
