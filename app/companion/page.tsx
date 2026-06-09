"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import Link from "next/link";

export default function Companion() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");
  const busy = status === "submitted" || status === "streaming";

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    sendMessage({ text });
    setInput("");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 py-6">
      <header className="mb-4 flex items-center justify-between">
        <Link href="/" className="text-sm text-stone-500 hover:text-stone-800">
          ← Willow
        </Link>
        <span className="text-sm font-medium text-emerald-700">
          Talk to Willow
        </span>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-stone-200 bg-white p-5">
        {messages.length === 0 && (
          <p className="py-12 text-center text-stone-400">
            Say hello — Willow is listening.
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={m.role === "user" ? "text-right" : "text-left"}
          >
            <div
              className={
                "inline-block max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm " +
                (m.role === "user"
                  ? "bg-emerald-700 text-white"
                  : "bg-stone-100 text-stone-800")
              }
            >
              {m.parts
                .map((p) => (p.type === "text" ? p.text : ""))
                .join("")}
            </div>
          </div>
        ))}
        {busy && <p className="text-left text-xs text-stone-400">Willow is thinking…</p>}
      </div>

      <form onSubmit={onSubmit} className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 rounded-full border border-stone-300 px-4 py-3 text-sm outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-emerald-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </main>
  );
}
