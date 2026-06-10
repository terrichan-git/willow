"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Turn = { role: "user" | "assistant"; text: string };

// Minimal Web Speech API typing (Chrome/Safari: webkitSpeechRecognition).
/* eslint-disable @typescript-eslint/no-explicit-any */
type SpeechRec = any;

export default function Companion() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [continuous, setContinuous] = useState(true);
  const [deceasedName, setDeceasedName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState(true);
  const [textInput, setTextInput] = useState("");
  const [legalGuide, setLegalGuide] = useState<any | null>(null);

  const recogRef = useRef<SpeechRec | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const turnsRef = useRef<Turn[]>([]);
  const continuousRef = useRef(true);
  turnsRef.current = turns;
  continuousRef.current = continuous;

  const ESTATE_ID = "mom-demo";

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) setSupported(false);
  }, []);

  const speak = useCallback(async (text: string) => {
    setSpeaking(true);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "TTS failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        setSpeaking(false);
        URL.revokeObjectURL(url);
        if (continuousRef.current) startListening();
      };
      await audio.play().catch(() => setSpeaking(false));
    } catch (e) {
      setError((e as Error).message);
      setSpeaking(false);
    }
  }, []);

  const sendText = useCallback(
    async (text: string) => {
      setError(null);
      setTurns((t) => [...t, { role: "user", text }]);
      setThinking(true);
      try {
        const res = await fetch("/api/companion", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ text, estateId: ESTATE_ID, history: turnsRef.current }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        if (data.deceasedName) setDeceasedName(data.deceasedName);
        if (data.legalGuide) setLegalGuide(data.legalGuide);
        setTurns((t) => [...t, { role: "assistant", text: data.reply }]);
        setThinking(false);
        await speak(data.reply);
      } catch (e) {
        setError((e as Error).message);
        setThinking(false);
      }
    },
    [speak]
  );

  const startListening = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return setSupported(false);
    if (audioRef.current) audioRef.current.pause();
    const recog: SpeechRec = new SR();
    recog.lang = "en-US";
    recog.interimResults = false;
    recog.maxAlternatives = 1;
    recog.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript.trim();
      setListening(false);
      if (transcript) sendText(transcript);
    };
    recog.onerror = (e: any) => {
      setListening(false);
      if (e.error !== "no-speech" && e.error !== "aborted") setError(`Mic: ${e.error}`);
    };
    recog.onend = () => setListening(false);
    recogRef.current = recog;
    setListening(true);
    setError(null);
    recog.start();
  }, [sendText]);

  function toggleMic() {
    if (listening) {
      recogRef.current?.stop();
      setListening(false);
    } else {
      startListening();
    }
  }

  function onTextSubmit(e: React.FormEvent) {
    e.preventDefault();
    const t = textInput.trim();
    if (!t || thinking || speaking) return;
    setTextInput("");
    sendText(t);
  }

  const busy = thinking || speaking;
  const status = listening ? "Listening…" : thinking ? "Thinking…" : speaking ? "Speaking…" : "Tap the mic to talk";

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl flex-col">
      <header className="mb-5">
        <p className="eyebrow mb-1.5">Companion</p>
        <h1 className="font-display text-[30px] font-normal leading-tight text-onyx">
          {deceasedName ? `${deceasedName}'s companion.` : "Your companion."}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">A two-way conversation, in their own voice.</p>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-hairline bg-paper p-5 shadow-[0_1px_3px_rgba(28,58,46,0.05)]">
        {turns.length === 0 && (
          <p className="py-10 text-center text-ink-faint">
            This is a two-way conversation in {deceasedName ?? "your loved one"}&apos;s voice.
            <br />Tap the mic and speak — they&apos;re listening.
          </p>
        )}
        {turns.map((t, i) => (
          <div key={i} className={t.role === "user" ? "text-right" : "text-left"}>
            <div
              className={
                "inline-block max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm " +
                (t.role === "user" ? "bg-sage-soft text-onyx" : "bg-chalk text-ink")
              }
            >
              {t.text}
            </div>
          </div>
        ))}
        {thinking && <p className="text-left text-xs text-ink-faint">…</p>}
      </div>

      {error && <p className="mt-3 text-center text-sm text-clay">{error}</p>}

      {legalGuide && !legalGuide.error && (
        <div className="mt-4 rounded-2xl border border-hairline bg-paper p-5 text-sm">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-[17px] font-medium text-onyx">Legal Guide — cross-border estate research</h2>
            <span className="rounded-full bg-pending-soft px-2.5 py-1 text-xs font-medium text-pending">
              recommend professional review
            </span>
          </div>
          {legalGuide.summary && <p className="text-ink">{legalGuide.summary}</p>}
          <dl className="mt-3 space-y-1 text-ink">
            {legalGuide.deceasedCountry?.inheritanceOrEstateTax && (
              <Row k={legalGuide.deceasedCountry.jurisdiction} v={legalGuide.deceasedCountry.inheritanceOrEstateTax} />
            )}
            {legalGuide.heirCountry?.situsRules && (
              <Row k={legalGuide.heirCountry.jurisdiction} v={legalGuide.heirCountry.situsRules} />
            )}
            {!!legalGuide.heirCountry?.reportingForms?.length && (
              <Row k="Reporting" v={legalGuide.heirCountry.reportingForms.join(" · ")} />
            )}
            {legalGuide.recommendedRoute?.summary && <Row k="Recommended" v={legalGuide.recommendedRoute.summary} />}
            {legalGuide.willVsTrust?.recommendation && (
              <Row k="Will vs trust" v={`${legalGuide.willVsTrust.recommendation} — ${legalGuide.willVsTrust.why}`} />
            )}
          </dl>
          {!!legalGuide.sources?.length && (
            <div className="mt-3">
              <p className="eyebrow !text-ink-muted text-xs">Sources</p>
              <ul className="mt-1 space-y-0.5">
                {legalGuide.sources.slice(0, 5).map((s: any, i: number) => (
                  <li key={i}>
                    <a className="text-teal underline" href={s.url} target="_blank" rel="noreferrer">
                      {s.title || s.url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {legalGuide.disclaimer && <p className="mt-3 text-xs italic text-ink-muted">{legalGuide.disclaimer}</p>}
        </div>
      )}

      <div className="mt-5 flex flex-col items-center gap-3">
        <button
          onClick={toggleMic}
          disabled={busy}
          className={
            "flex h-20 w-20 items-center justify-center rounded-full text-chalk shadow-lg transition disabled:opacity-50 " +
            (listening ? "animate-pulse bg-clay" : "bg-teal hover:bg-teal-deep")
          }
          aria-label="Microphone"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="2" width="6" height="12" rx="3" />
            <path d="M5 10a7 7 0 0 0 14 0M12 17v5" />
          </svg>
        </button>
        <p className="text-sm text-ink-muted">{status}</p>

        <label className="flex items-center gap-2 text-xs text-ink-muted">
          <input type="checkbox" checked={continuous} onChange={(e) => setContinuous(e.target.checked)} />
          Continuous conversation (re-open mic after each reply)
        </label>

        {!supported && (
          <p className="text-center text-xs text-pending">
            Speech recognition isn&apos;t supported in this browser — use Chrome, or type below.
          </p>
        )}

        <form onSubmit={onTextSubmit} className="mt-1 flex w-full gap-2">
          <input
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="…or type instead"
            className="flex-1 rounded-full border border-edge bg-paper px-4 py-2 text-sm outline-none focus:border-teal"
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-onyx px-4 py-2 text-sm font-medium text-chalk disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-32 shrink-0 font-medium text-ink-muted">{k}</dt>
      <dd className="flex-1">{v}</dd>
    </div>
  );
}
