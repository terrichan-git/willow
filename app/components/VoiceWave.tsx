"use client";

// The Willow signature audio motif: a row of slim rounded bars (never sine waves).
// Bars gently pulse while active; static at rest. Respects prefers-reduced-motion.
export default function VoiceWave({
  bars = 36,
  height = 40,
  active = false,
  color = "var(--color-sage)",
  idleColor,
}: {
  bars?: number;
  height?: number;
  active?: boolean;
  color?: string;
  idleColor?: string;
}) {
  // Deterministic integer heights so SSR and client serialize identically.
  const heights = Array.from({ length: bars }, (_, i) => {
    const t = Math.sin(i * 12.9898) * 43758.5453;
    const r = t - Math.floor(t);
    return Math.max(4, Math.round((0.25 + r * 0.75) * height));
  });

  return (
    <div className="flex items-center justify-center gap-[3px]" style={{ height }} aria-hidden>
      {heights.map((h, i) => (
        <span
          key={i}
          className={active ? "willow-wave-bar" : ""}
          style={{
            width: "3px",
            borderRadius: "99px",
            height: `${h}px`,
            background: active ? color : idleColor || color,
            animationDelay: active ? `${(i % 9) * 90}ms` : undefined,
          }}
        />
      ))}
    </div>
  );
}
