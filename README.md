# Willow

An agentic platform that helps people prepare their digital estate while alive,
then activates an AI companion — speaking in their own cloned voice — to guide
loved ones through everything that needs to happen after they pass.

Built solo at the **SuperAI NEXT Hackathon 2026** (Marina Bay Sands, Singapore).

## Stack

- **Frontend:** Next.js 15 (App Router) + Tailwind v4, deployed on **Vercel**
- **AI:** **Vercel AI SDK** + **AI Gateway** (chat/streaming), **AWS Bedrock** (agents)
- **Backend:** AWS Lambda + Step Functions + DynamoDB + S3
- **External:** Exa (institution/legal research), Stripe (payments), ElevenLabs (voice)

## Local development

```bash
npm install
cp .env.local.example .env.local   # then fill in AI_GATEWAY_API_KEY
npm run dev
```

Open http://localhost:3000 — the landing page. `/companion` is a live chat
backed by the AI Gateway (Phase 1 verification).

## Environment

| Variable | Purpose |
|---|---|
| `AI_GATEWAY_API_KEY` | Vercel AI Gateway key — routes model calls |

Later phases add `EXA_API_KEY`, `ELEVENLABS_API_KEY`, `STRIPE_SECRET_KEY`, AWS creds.
