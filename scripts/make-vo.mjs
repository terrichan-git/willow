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

// multilingual_v2 holds the voice's real accent steady (no v3 per-generation drift).
// It ignores [emotion] tags, so they're stripped — delivery comes from voice + punctuation.
const MODEL = process.env.VO_MODEL || "eleven_multilingual_v2";
const KEEP_TAGS = MODEL === "eleven_v3"; // only v3 interprets [emotion] tags

// Voice tokens -> ElevenLabs voiceIds.
const VOICE_MAP = {
  // MOM_SG: mature, warm, Singaporean/SE-Asian maternal (library voice — needs a paid plan).
  // Set after the M1 A/B pick; override without editing via MOM_SG_VOICE_ID.
  MOM_SG: process.env.MOM_SG_VOICE_ID || process.env.ELEVENLABS_VOICE_ID || "XrExE9yKIg1WjnnlVkGX",
  SARAH: process.env.SARAH_VOICE_ID || "ljEOxtzNoGEa58anWyea", // Jane — young-sounding Singaporean (the daughter)
  NARRATOR: process.env.NARRATOR_VOICE_ID || "JBFqnCBsd6RMkjVDRZzb", // George — warm male storyteller (distinct from the female leads)
};

// Per-voice settings. SARAH (Jane) reads fast, so she gets higher stability, lower
// style, and slower speed to calm the pace.
// v2 settings: higher similarity = faithful to the cloned accent; modest style = natural.
const DEFAULT_SETTINGS = { stability: 0.5, similarity_boost: 0.9, style: 0.2, use_speaker_boost: true };
const SETTINGS_BY_VOICE = {
  SARAH: { stability: 0.5, similarity_boost: 0.85, style: 0.2, use_speaker_boost: true, speed: 0.8 },
};
const settingsFor = (voice) => SETTINGS_BY_VOICE[voice] || DEFAULT_SETTINGS;

const stripTags = (t) => t.replace(/\[[^\]]*\]\s*/g, "").replace(/\s+/g, " ").trim();

// Exact tagged VO line list from Project Happiness/DEMO_VIDEO_PLAN.md.
const LINES = [
  { role: "maria", voice: "MOM_SG", out: "vo/N1.mp3", text: "[gently] Sometimes I lie awake and think… if I wasn't here tomorrow, would the people I love be okay? [softly] Not just the money. Would my daughter know which bank to call… [emotional] and would she still have someone to talk to on a bad day? [gently] We write wills for our assets. [softly] Nobody leaves a plan for the love." },
  { role: "maria", voice: "MOM_SG", out: "vo/N2.mp3", text: "[warmly] So I sat down with Willow. Just a conversation — my accounts and insurance, my will, the house, even my digital logins, and the people I'd want told first. [softly] It turned everything in my head into one calm plan." },
  { role: "maria", voice: "MOM_SG", out: "vo/N3.mp3", text: "[gently] And it didn't stop at organizing — it made the plan stronger. A will can be contested, tied up in probate… so for Sarah, Willow suggested a trust, and showed me how it could keep growing for her, [warmly] even after I'm gone." },
  { role: "maria", voice: "MOM_SG", out: "vo/N4.mp3", text: "[tenderly] And then it asked me to do the one thing no will ever has. [softly] To leave my voice — so I could still be here for her." },
  { role: "sarah", voice: "SARAH", out: "vo/S1.mp3", text: "[sad] Mum… I had the worst day. The MRT was so packed… [emotional] and I just miss talking to you." },
  { role: "maria", voice: "MOM_SG", out: "vo/M1.mp3", text: "[warmly] Aiyoh, I know that squeeze on the East-West line… [tenderly] come here, sayang. Tell me everything. [softly] The bad days are lighter when you say them out loud — you taught me that." },
  { role: "sarah", voice: "SARAH", out: "vo/S2.mp3", text: "[gently] Mum… what happens to all your money — the US shares — when you're gone? [softly] I'm in New York now." },
  { role: "maria", voice: "MOM_SG", out: "vo/M2.mp3", text: "[gently] I've got you, sayang. Here in Singapore there's no estate tax — the CPF and the DBS savings pass to you cleanly. [warmly] But the US shares are US-situs, and America taxes those above only sixty thousand — so get a cross-border advisor early. You'll file a Form 3520, but that's only reporting, not a tax. [softly] The AIA policy and everything else is in the blue folder, in the study." },
  { role: "maria", voice: "MOM_SG", out: "vo/M3.mp3", text: "[tenderly] And Sarah… [emotional] you don't have to be strong all the time, okay? [softly] I'm so proud of you. That's all I ever wanted, my love." },
  { role: "narrator", voice: "NARRATOR", out: "vo/N5.mp3", text: "[calm] Every word was real. Behind Maria's voice, agents on AWS researched two countries' estate laws with Exa — and chose the most cost-efficient path." },
  { role: "narrator", voice: "NARRATOR", out: "vo/N6.mp3", text: "[gently] Willow. [softly] Leave them clarity. Leave them your voice." },
];

async function render(line) {
  const voiceId = VOICE_MAP[line.voice];
  if (!voiceId) throw new Error(`No voiceId mapped for "${line.voice}"`);
  const text = KEEP_TAGS ? line.text : stripTags(line.text);
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: { "xi-api-key": KEY, "content-type": "application/json" },
    body: JSON.stringify({ text, model_id: MODEL, voice_settings: settingsFor(line.voice) }),
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
