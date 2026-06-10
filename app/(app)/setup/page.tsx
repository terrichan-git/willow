"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useState } from "react";

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

// Presentational only: the "your estate, taking shape" rail derives from the saved profile.
function railSections(p?: SavedProfile | null) {
  const fam = p?.personalInfo?.familyMembers || [];
  return [
    {
      label: "Family & executor",
      icon: "M16 11a4 4 0 10-8 0M12 7a3 3 0 100-6 3 3 0 000 6zM3 21a7 7 0 0118 0",
      lines: fam.length
        ? [...fam.map((f) => `${f.name}${f.relationship ? ` · ${f.relationship}` : ""}`), p?.personalInfo?.executor ? `Executor: ${p.personalInfo.executor}` : ""].filter(Boolean)
        : [],
    },
    {
      label: "Financial accounts",
      icon: "M3 9l9-6 9 6M5 9v11h14V9M9 20v-6h6v6",
      lines: (p?.financialAccounts || []).map((a) => `${a.institution}${a.type ? ` · ${a.type}` : ""}`),
    },
    {
      label: "Insurance",
      icon: "M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6l8-3z",
      lines: (p?.insurancePolicies || []).map((i) => `${i.provider}${i.type ? ` · ${i.type}` : ""}`),
    },
    {
      label: "Will & legal",
      icon: "M7 3h10v18H7zM10 8h4M10 12h4M10 16h2",
      lines: p?.will?.exists ? [`In place${p.will.location ? ` · ${p.will.location}` : ""}`] : [],
    },
    {
      label: "Property & assets",
      icon: "M4 21V8l8-5 8 5v13M9 21v-6h6v6",
      lines: (p?.propertyAssets || []).map((x) => x.description || x.type || "").filter(Boolean),
    },
    {
      label: "Digital accounts",
      icon: "M5 6h14v10H5zM2 20h20",
      lines: (p?.digitalAccounts || []).map((d) => d.platform),
    },
    {
      label: "A message",
      icon: "M12 21s-7-4.7-9.3-9A5.5 5.5 0 0112 6.5 5.5 5.5 0 0121.3 12C19 16.3 12 21 12 21z",
      lines: p?.wishesMessage ? [p.wishesMessage] : [],
    },
  ];
}

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

  const sections = railSections(saved?.profile);
  const started = sections.filter((s) => s.lines.length > 0).length;
  const progress = Math.round((started / (sections.length + 1)) * 100); // +1 for "your voice"

  return (
    <div>
      {/* Header */}
      <header className="mb-5">
        <p className="eyebrow mb-1.5">Step 1 of 3</p>
        <h1 className="font-display text-[34px] font-normal leading-tight text-onyx sm:text-[40px]">One calm conversation.</h1>
        <p className="mt-2 max-w-xl text-[16px] text-ink-muted">
          Willow listens, and your estate takes shape beside you. Skip anything; come back any time.
        </p>
      </header>

      {/* Journey stepper */}
      <ol className="mb-6 flex flex-wrap items-center gap-1">
        {[
          { n: 1, label: "Tell Willow about your estate", current: true },
          { n: 2, label: "Record your voice" },
          { n: 3, label: "Your dashboard" },
        ].map((s, i) => (
          <li key={s.n} className="flex items-center">
            <span className="flex items-center gap-2 rounded-full px-2.5 py-1.5">
              <span
                className={
                  "flex h-[22px] w-[22px] items-center justify-center rounded-full text-[11.5px] font-semibold " +
                  (s.current ? "bg-teal text-chalk" : "border border-edge bg-paper text-ink-muted")
                }
              >
                {s.n}
              </span>
              <span className={"whitespace-nowrap text-xs " + (s.current ? "font-medium text-onyx" : "text-ink-muted")}>{s.label}</span>
            </span>
            {i < 2 && <span className="mx-1 h-px w-5 bg-edge" aria-hidden />}
          </li>
        ))}
      </ol>

      {paid && (
        <div className="mb-4 rounded-xl border border-hairline bg-sage-soft px-4 py-3 text-sm text-onyx">
          ✓ Payment received. Let&apos;s build your Estate Readiness profile — it only takes a few minutes.
        </div>
      )}

      {/* Stage: chat + rail */}
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Chat card */}
        <div className="flex min-h-[540px] flex-col overflow-hidden rounded-2xl border border-hairline bg-paper shadow-[0_1px_3px_rgba(28,58,46,0.05)]">
          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            {messages.length === 0 && (
              <div className="text-left">
                <div className="inline-block max-w-[85%] rounded-2xl border border-hairline bg-raised px-4 py-3 text-sm text-ink">
                  Hello — I&apos;m Willow. In one calm conversation, we&apos;ll organize the essentials: your family,
                  your accounts and insurance, your will and property, and a message for the people you love.
                  <br />
                  <br />
                  Nothing is required, and you can skip anything. Whenever you&apos;re ready — tell me your name and
                  where you live.
                </div>
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={m.role === "user" ? "text-right" : "text-left"}>
                <div
                  className={
                    "inline-block max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm " +
                    (m.role === "user" ? "bg-sage-soft text-onyx" : "border border-hairline bg-raised text-ink")
                  }
                >
                  {m.parts.map((p) => (p.type === "text" ? p.text : "")).join("")}
                </div>
              </div>
            ))}
            {busy && <p className="text-left text-xs text-ink-faint">Willow is thinking…</p>}
          </div>

          <div className="border-t border-hairline p-4">
            <form onSubmit={onSubmit} className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Or write it your own way…"
                className="flex-1 rounded-full border border-edge bg-raised px-4 py-3 text-sm outline-none transition focus:border-teal"
              />
              <button
                type="submit"
                disabled={busy}
                aria-label="Send"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage text-onyx transition hover:bg-teal hover:text-chalk disabled:opacity-50"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </form>
            <div className="mt-3 flex items-center justify-between gap-3">
              <button
                onClick={save}
                disabled={saving || messages.length === 0}
                className="rounded-full border border-teal px-5 py-2 text-sm font-medium text-teal transition hover:bg-sage-mist disabled:opacity-40"
              >
                {saving ? "Saving…" : "Save my plan"}
              </button>
              <span className="text-xs text-ink-faint">Record your voice next.</span>
            </div>
            {saveError && <p className="mt-2 text-sm text-clay">{saveError}</p>}
            {saved && (
              <p className="mt-2 text-sm font-medium text-teal">
                Saved to your estate ✓ <span className="font-normal text-ink-muted">({saved.userId})</span>
              </p>
            )}
          </div>
        </div>

        {/* Rail: your estate, taking shape */}
        <aside className="rounded-2xl border border-hairline bg-paper p-5 shadow-[0_1px_3px_rgba(28,58,46,0.05)]">
          <div className="flex items-baseline justify-between">
            <p className="eyebrow">Your estate, taking shape</p>
            <span className="font-display text-lg font-medium text-teal">{progress}%</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-chalk-deep">
            <div className="h-full rounded-full bg-teal transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-xs text-ink-muted">
            {started === 0 ? "It begins with a conversation" : `${started} of ${sections.length + 1} sections started`}
          </p>

          <ul className="mt-4 space-y-1.5">
            {sections.map((s) => {
              const startedSection = s.lines.length > 0;
              return (
                <li
                  key={s.label}
                  className={"flex gap-3 rounded-xl p-2.5 " + (startedSection ? "bg-sage-soft" : "")}
                >
                  <span
                    className={
                      "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full " +
                      (startedSection ? "bg-sage text-chalk" : "border border-hairline bg-raised text-ink-faint")
                    }
                  >
                    {startedSection ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4L19 6" /></svg>
                    ) : (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d={s.icon} /></svg>
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-onyx">{s.label}</p>
                    {startedSection ? (
                      s.lines.slice(0, 3).map((l, i) => (
                        <p key={i} className="truncate text-xs text-ink-muted">{l}</p>
                      ))
                    ) : (
                      <p className="text-xs text-ink-faint">Not yet</p>
                    )}
                  </div>
                </li>
              );
            })}
            <li className="flex gap-3 rounded-xl p-2.5">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-hairline bg-raised text-ink-faint">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a4 4 0 014 4v3a4 4 0 01-8 0V7a4 4 0 014-4zM6 11a6 6 0 0012 0M12 17v4" /></svg>
              </span>
              <div>
                <p className="text-sm font-medium text-onyx">Your voice</p>
                <p className="text-xs text-ink-faint">After this conversation</p>
              </div>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
