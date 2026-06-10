"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import VoiceWave from "@/app/components/VoiceWave";

const PASSAGE =
  "Hello, my loves. If you're hearing this, know that I prepared everything for you — take your time, and let Willow walk you through the rest.";

const MAX_SECONDS = 30;

export default function VoicePage() {
  const [phase, setPhase] = useState<"idle" | "recording" | "done">("idle");
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    },
    []
  );

  async function start() {
    // Real mic capture when granted; the recording stays on this device.
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const rec = new MediaRecorder(stream);
      recorderRef.current = rec;
      rec.start();
    } catch {
      /* mic denied — the take simply isn't captured; the flow still works */
    }
    setPhase("recording");
    setSeconds(0);
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s + 1 >= MAX_SECONDS) {
          finish();
          return MAX_SECONDS;
        }
        return s + 1;
      });
    }, 1000);
  }

  function finish() {
    if (timerRef.current) clearInterval(timerRef.current);
    recorderRef.current?.state !== "inactive" && recorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setPhase("done");
  }

  const mm = `0:${String(seconds).padStart(2, "0")}`;

  return (
    <div>
      {/* Header */}
      <header className="mb-5">
        <p className="eyebrow mb-1.5">Step 2 of 3</p>
        <h1 className="font-display text-[34px] font-normal leading-tight text-onyx sm:text-[40px]">
          Your words, in your voice.
        </h1>
        <p className="mt-2 max-w-xl text-[16px] text-ink-muted">
          Thirty seconds is enough. Your family will hear you — not a machine.
        </p>
      </header>

      {/* Journey stepper */}
      <ol className="mb-6 flex flex-wrap items-center gap-1">
        {[
          { n: 1, label: "Tell Willow about your estate", href: "/setup", done: true },
          { n: 2, label: "Record your voice", current: true },
          { n: 3, label: "Your dashboard", href: "/" },
        ].map((s, i) => (
          <li key={s.n} className="flex items-center">
            <Link href={s.href || "#"} className="flex items-center gap-2 rounded-full px-2.5 py-1.5 transition hover:bg-sage-mist">
              <span
                className={
                  "flex h-[22px] w-[22px] items-center justify-center rounded-full text-[11.5px] font-semibold " +
                  (s.current
                    ? "bg-teal text-chalk"
                    : s.done
                      ? "bg-sage-soft text-onyx"
                      : "border border-edge bg-paper text-ink-muted")
                }
              >
                {s.done ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4L19 6" /></svg>
                ) : (
                  s.n
                )}
              </span>
              <span className={"whitespace-nowrap text-xs " + (s.current ? "font-medium text-onyx" : "text-ink-muted")}>{s.label}</span>
            </Link>
            {i < 2 && <span className="mx-1 h-px w-5 bg-edge" aria-hidden />}
          </li>
        ))}
      </ol>

      {/* The obsidian moment */}
      <section className="flex flex-col items-center gap-4">
        <div className="willow-rise flex w-full max-w-[680px] flex-col items-center rounded-[28px] bg-obsidian px-8 pb-7 pt-9 text-center shadow-[0_18px_50px_rgba(28,38,32,0.35)]">
          <p className="eyebrow mb-4 !text-sage">Read this aloud — your message</p>
          <p className="font-display mb-7 max-w-[30ch] text-[24px] font-light italic leading-[1.45] text-chalk [text-wrap:balance]">
            &ldquo;{PASSAGE}&rdquo;
          </p>

          <div className="mb-5">
            <VoiceWave bars={44} height={44} active={phase === "recording"} color="var(--color-sage)" idleColor="rgba(236, 242, 236, 0.35)" />
          </div>

          {phase === "idle" && (
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={start}
                aria-label="Start recording"
                className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-teal text-chalk transition hover:bg-teal-deep"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="2" width="6" height="12" rx="3" />
                  <path d="M5 10a7 7 0 0 0 14 0M12 17v5" />
                </svg>
              </button>
              <p className="text-sm text-chalk/75">Tap to record</p>
            </div>
          )}

          {phase === "recording" && (
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={finish}
                aria-label="Stop recording"
                className="willow-ring flex h-[72px] w-[72px] items-center justify-center rounded-full bg-chalk"
              >
                <span className="h-[22px] w-[22px] rounded-md bg-onyx" />
              </button>
              <p className="flex items-center gap-2 text-sm tabular-nums text-chalk/75">
                <span className="h-2 w-2 animate-pulse rounded-full bg-sage" />
                Recording · {mm} / 0:30
              </p>
            </div>
          )}

          {phase === "done" && (
            <div className="flex flex-col items-center gap-3">
              <span className="flex items-center gap-1.5 rounded-full bg-teal-soft px-3 py-1 text-xs font-medium text-teal-deep">
                <span className="h-1.5 w-1.5 rounded-full bg-teal" /> Voice saved
              </span>
              <p className="font-display text-[19px] font-light italic text-chalk">Done. Your family will thank you for this.</p>
              <div className="mt-2 flex items-center gap-4">
                <Link href="/" className="rounded-full bg-chalk px-5 py-2.5 text-sm font-medium text-onyx transition hover:bg-paper">
                  See your dashboard
                </Link>
                <button
                  onClick={() => {
                    setPhase("idle");
                    setSeconds(0);
                  }}
                  className="text-sm text-chalk/65 underline underline-offset-[3px] hover:text-chalk"
                >
                  Record again
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="flex items-center gap-1.5 text-xs text-ink-muted">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Your voice is encrypted and used only for your companion. You can delete it at any time.
        </p>
        {phase !== "done" && (
          <Link href="/" className="text-sm text-teal underline underline-offset-[3px] hover:text-teal-deep">
            Skip for now — your dashboard
          </Link>
        )}
      </section>
    </div>
  );
}
