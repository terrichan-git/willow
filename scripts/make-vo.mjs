// Willow — render the demo voiceover lines to MP3 via ElevenLabs.
// Run: node --env-file=.env.local scripts/make-vo.mjs
//
// Renders the VO line list (role/voice/text/out) from DEMO_VIDEO_PLAN.md. Maps each
// `voice` token to an ElevenLabs voiceId and writes one MP3 per line into /vo.
//
// Model: eleven_v3 reads the [warmly]/[gently]/[sighs] emotion tags. If you force a
// non-v3 model, the [...] tags are STRIPPED before sending so they aren't read aloud.

import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) {
  console.error("ELEVENLABS_API_KEY not set (run with: node --env-file=.env.local scripts/make-vo.mjs)");
  process.exit(1);
}

const MODEL = process.env.VO_MODEL || "eleven_v3";
const KEEP_TAGS = MODEL === "eleven_v3"; // only v3 interprets [emotion] tags

// Voice tokens -> ElevenLabs voiceIds.
const VOICE_MAP = {
  // MOM_SG: mature, warm, Singaporean/SE-Asian maternal (library voice — needs a paid plan).
  // Set after the M1 A/B pick; override without editing via MOM_SG_VOICE_ID.
  MOM_SG: process.env.MOM_SG_VOICE_ID || process.env.ELEVENLABS_VOICE_ID || "XrExE9yKIg1WjnnlVkGX",
  SARAH: process.env.SARAH_VOICE_ID || "1FcaCa84nUabCNNwbzBa", // Emma — warm, young, Singaporean
  NARRATOR: process.env.NARRATOR_VOICE_ID || "JBFqnCBsd6RMkjVDRZzb", // George — warm male storyteller (distinct from the female leads)
};

const SETTINGS = { stability: 0.35, similarity_boost: 0.8, style: 0.55, use_speaker_boost: true };

const stripTags = (t) => t.replace(/\[[^\]]*\]\s*/g, "").replace(/\s+/g, " ").trim();

// Exact tagged VO line list from Project Happiness/DEMO_VIDEO_PLAN.md.
const LINES = [
  { role: "narrator", voice: "NARRATOR", out: "vo/N1.mp3", text: "[gently] We spend our whole lives taking care of the people we love. But almost no one plans for the part that comes after." },
  { role: "narrator", voice: "NARRATOR", out: "vo/N2.mp3", text: "[warmly] Margaret did. While she was well, she sat with Willow and organized everything — her accounts, her wishes. [softly] And then, her voice." },
  { role: "narrator", voice: "NARRATOR", out: "vo/N3.mp3", text: "[gently] Months later, her daughter Sarah opened it." },
  { role: "sarah", voice: "SARAH", out: "vo/S1.mp3", text: "[sad] Mum… I had such a hard day. [emotional] I keep reaching for the phone to call you." },
  { role: "mom", voice: "MOM_SG", out: "vo/M1.mp3", text: "[warmly] Oh… my little sparrow. [tenderly] Come here, sayang. I miss you too — [emotional] more than you know. [softly] Have you eaten or not?" },
  { role: "sarah", voice: "SARAH", out: "vo/S2.mp3", text: "[emotional] I miss you so much." },
  { role: "mom", voice: "MOM_SG", out: "vo/M2.mp3", text: "[gently] I'm right here, sayang. I organized it all so you'd never face it alone. [warmly] The AIA policy — A I A, S G, seven-seven-two-three-one — it's all for you. The claim hotline is one-eight-hundred, two-four-eight, eight thousand, and you have six months. [softly] Everything's in the blue folder, top drawer of the study desk." },
  { role: "mom", voice: "MOM_SG", out: "vo/M3.mp3", text: "[tenderly] And Sarah… [emotional] please don't carry all of this on your own, okay? Lean on the people who love you. [sighs] [softly] That's all I ever wanted, my love." },
  { role: "narrator", voice: "NARRATOR", out: "vo/N4.mp3", text: "[calm] Behind her mother's voice, Willow's agents researched two countries' laws — found the policy, the deadline, the most efficient path — [warmly] and stood beside Sarah, step by step." },
  { role: "narrator", voice: "NARRATOR", out: "vo/N5.mp3", text: "[gently] Willow. [softly] Leave them clarity. Leave them your voice." },
];

async function render(line) {
  const voiceId = VOICE_MAP[line.voice];
  if (!voiceId) throw new Error(`No voiceId mapped for "${line.voice}"`);
  const text = KEEP_TAGS ? line.text : stripTags(line.text);
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: { "xi-api-key": KEY, "content-type": "application/json" },
    body: JSON.stringify({ text, model_id: MODEL, voice_settings: SETTINGS }),
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${(await res.text().catch(() => "")).slice(0, 200)}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(dirname(line.out), { recursive: true });
  await writeFile(line.out, buf);
  return buf.length;
}

console.log(`Model: ${MODEL} | tags: ${KEEP_TAGS ? "kept" : "stripped"} | MOM_SG=${VOICE_MAP.MOM_SG}`);
const done = [];
for (const line of LINES) {
  try {
    const bytes = await render(line);
    console.log(`✓ ${line.out.padEnd(10)} ${line.voice.padEnd(8)} ${(bytes / 1024).toFixed(0)} KB`);
    done.push(line.out);
  } catch (e) {
    console.error(`✗ ${line.out}: ${e.message}`);
  }
}
console.log(`\nRendered ${done.length}/${LINES.length} lines into /vo:`);
done.forEach((f) => console.log("  " + f));
