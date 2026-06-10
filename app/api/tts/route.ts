// Streams ElevenLabs TTS audio for the companion's reply (Matilda voice by default).
export const maxDuration = 30;

const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "XrExE9yKIg1WjnnlVkGX";
const MODEL = process.env.ELEVENLABS_MODEL || "eleven_turbo_v2_5"; // low latency for conversation

export async function POST(req: Request) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) return Response.json({ error: "ELEVENLABS_API_KEY not set" }, { status: 500 });

  const { text } = await req.json();
  if (!text) return Response.json({ error: "text is required" }, { status: 400 });

  const upstream = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: "POST",
    headers: { "xi-api-key": key, "content-type": "application/json" },
    body: JSON.stringify({
      text,
      model_id: MODEL,
      voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.3 },
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
