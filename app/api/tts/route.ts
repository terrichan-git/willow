// Streams ElevenLabs TTS audio for the companion's reply (Syalala — warm SE-Asian maternal).
export const maxDuration = 30;

const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "vRaj2Gd0mefB1EU96ua2";
const MODEL = process.env.ELEVENLABS_MODEL || "eleven_v3"; // reads [emotion] tags; richer delivery

// Keep any [emotion] tags in the audio text, but never let them reach a non-v3 model.
const stripTags = (t: string) => t.replace(/\[[^\]]*\]\s*/g, "").replace(/\s+/g, " ").trim();

export async function POST(req: Request) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) return Response.json({ error: "ELEVENLABS_API_KEY not set" }, { status: 500 });

  const { text } = await req.json();
  if (!text) return Response.json({ error: "text is required" }, { status: 400 });

  const upstream = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: "POST",
    headers: { "xi-api-key": key, "content-type": "application/json" },
    body: JSON.stringify({
      text: MODEL === "eleven_v3" ? text : stripTags(text),
      model_id: MODEL,
      voice_settings: { stability: 0.35, similarity_boost: 0.8, style: 0.55, use_speaker_boost: true },
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    return Response.json({ error: `ElevenLabs ${upstream.status}: ${detail.slice(0, 200)}` }, { status: 502 });
  }

  return new Response(upstream.body, {
    headers: { "content-type": "audio/mpeg", "cache-control": "no-store" },
  });
}
