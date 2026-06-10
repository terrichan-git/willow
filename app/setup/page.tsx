"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useState } from "react";
import Link from "next/link";

type SavedProfile = {
  personalInfo?: {
    name?: string | null;
    jurisdiction?: string | null;
    familyMembers?: { name: string; relationship?: string | null }[];
    executor?: string | null;
  };
  financialAccounts?: { institution: string; type?: string | null }[];
  insurancePolicies?: { provider: string; type?: string | null }[];
  will?: { exists?: boolean | null; location?: string | null; executorOrLawyer?: string | null };
  propertyAssets?: { type?: string | null; description?: string | null; location?: string | null }[];
  digitalAccounts?: { platform: string; notes?: string | null }[];
  wishesMessage?: string | null;
};

export default function Setup() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/onboard" }),
  });
  const [input, setInput] = useState("");
  const [paid, setPaid] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<{ userId: string; profile: SavedProfile } | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    setPaid(new URLSearchParams(window.location.search).get("paid") === "1");
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    sendMessage({ text });
    setInput("");
  }

  async function save() {
    setSaving(true);
    setSaveError(null);
    try {
      const userId = localStorage.getItem("willow_user_id") || undefined;
      const res = await fetch("/api/estate/save", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages, userId }),
      });
      const data = await res.json();
      if (data.ok) {
        localStorage.setItem("willow_user_id", data.userId);
        setSaved({ userId: data.userId, profile: data.profile });
      } else {
        setSaveError(data.error || "Could not save.");
      }
    } catch (e) {
      setSaveError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 py-6">
      <header className="mb-4 flex items-center justify-between">
        <Link href="/" className="text-sm text-stone-500 hover:text-stone-800">← Willow</Link>
        <span className="text-sm font-medium text-emerald-700">Set up your estate</span>
      </header>

      {paid && (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          ✓ Payment received. Let&apos;s build your Estate Readiness profile — it only takes a few minutes.
        </div>
      )}

      <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-stone-200 bg-white p-5">
        {messages.length === 0 && (
          <div className="text-left">
            <div className="inline-block max-w-[85%] rounded-2xl bg-stone-100 px-4 py-2 text-sm text-stone-800">
              Hi — I&apos;m Willow&apos;s Legacy Builder. In one calm conversation I&apos;ll help you organize the
              essentials: your family and executor, your accounts and insurance, your will and property, your digital
              accounts, and a message for the people you love. Whenever you&apos;re ready, tell me your name and where
              you live.
            </div>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "text-right" : "text-left"}>
            <div
              className={
                "inline-block max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm " +
                (m.role === "user" ? "bg-emerald-700 text-white" : "bg-stone-100 text-stone-800")
              }
            >
              {m.parts.map((p) => (p.type === "text" ? p.text : "")).join("")}
            </div>
          </div>
        ))}
        {busy && <p className="text-left text-xs text-stone-400">Willow is thinking…</p>}
      </div>

      <form onSubmit={onSubmit} className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer…"
          className="flex-1 rounded-full border border-stone-300 px-4 py-3 text-sm outline-none focus:border-emerald-500"
        />
        <button type="submit" disabled={busy} className="rounded-full bg-emerald-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:opacity-50">
          Send
        </button>
      </form>

      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          onClick={save}
          disabled={saving || messages.length === 0}
          className="rounded-full border border-emerald-700 px-5 py-2.5 text-sm font-medium text-emerald-800 transition hover:bg-emerald-50 disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save my plan"}
        </button>
        <span className="text-xs text-stone-400">Record your voice next.</span>
      </div>

      {saveError && <p className="mt-3 text-sm text-red-600">{saveError}</p>}

      {saved && (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 text-sm">
          <p className="mb-2 font-semibold text-emerald-900">Saved to your estate ✓ <span className="font-normal text-emerald-700">({saved.userId})</span></p>
          <dl className="space-y-1 text-stone-700">
            <Field label="Name" value={saved.profile.personalInfo?.name} />
            <Field label="Jurisdiction" value={saved.profile.personalInfo?.jurisdiction} />
            <Field label="Family" value={saved.profile.personalInfo?.familyMembers?.map((f) => `${f.name}${f.relationship ? ` (${f.relationship})` : ""}`).join(", ")} />
            <Field label="Executor" value={saved.profile.personalInfo?.executor} />
            <Field label="Accounts" value={saved.profile.financialAccounts?.map((a) => `${a.institution}${a.type ? ` · ${a.type}` : ""}`).join(", ")} />
            <Field label="Insurance" value={saved.profile.insurancePolicies?.map((p) => `${p.provider}${p.type ? ` · ${p.type}` : ""}`).join(", ")} />
            <Field label="Will" value={saved.profile.will ? `${saved.profile.will.exists ? "Yes" : saved.profile.will.exists === false ? "No" : "—"}${saved.profile.will.location ? ` · ${saved.profile.will.location}` : ""}` : undefined} />
            <Field label="Property" value={saved.profile.propertyAssets?.map((p) => p.description || p.type).filter(Boolean).join(", ")} />
            <Field label="Digital" value={saved.profile.digitalAccounts?.map((d) => d.platform).join(", ")} />
            <Field label="Wishes" value={saved.profile.wishesMessage} />
          </dl>
        </div>
      )}
    </main>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex gap-2">
      <dt className="w-28 shrink-0 text-stone-500">{label}</dt>
      <dd className="flex-1">{value || "—"}</dd>
    </div>
  );
}
