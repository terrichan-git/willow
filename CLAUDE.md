# CLAUDE.md — Willow (build engine context)

You are the **build engine** for **Willow**, a solo entry in the **SuperAI NEXT Hackathon 2026** (Marina Bay Sands, Singapore). Read this file fully before acting. Deeper detail lives in `docs/` — read those when you start a phase.

## What Willow is
An agentic platform that helps people prepare their **digital estate while alive**, then activates an **AI companion that speaks in their own cloned voice** to guide loved ones through everything that must happen after they pass. The emotional centerpiece is a two-way voice conversation with the deceased's companion. The business is an ascension funnel (free quiz → $9 readiness report → $79 full plan → $149/yr family plan) with real Stripe revenue.

## Deadline & stakes
- **Submit by 11:59pm, 10 June 2026.** Solo builder (Terri). ~34h at start.
- Submission = public GitHub repo + live URL + `.ppt`/`.keynote` slides (Cowork builds the deck).

## WIN CONDITIONS — optimize every decision against these
**Mandatory to qualify for Top 5 (judges verify):**
1. **AWS infrastructure runs the agents** — agents must run on AWS services (compute, database, AI/ML endpoint), *not just call external APIs*. Our proof: agent logic on **Lambda** calling **Bedrock** (Claude) as the AI/ML endpoint, with **DynamoDB** + **S3**. Must be real and visible in CloudWatch/console.
2. **Vercel integration** — at least one of AI Gateway / AI SDK (Sandbox) / AI SDK (Workflows). Our proof: frontend chat routes through **Vercel AI Gateway** (already wired in `app/api/chat/route.ts`).

**Stackable prizes (build for these too):**
- **Best use of Exa** — the **Institution Researcher** agent (real-time, structured, cited web research on death-notification procedures) is our showcase.
- **Best use of Stripe** — the full ascension funnel + real live transactions during the event.

**Judging criteria to play to:** Agent Overview, Autonomy & Decision-Making, Actions & Tool Use, Orchestration (multi-agent), Human-in-the-Loop, Failure Handling, Demo & Presentation.

## Operating model — two Claudes, one team
- **You (Claude Code) = build engine.** You own the **terminal, git, npm, AWS CLI, deploys, and backend code**. You provision AWS, write/iterate Lambdas, run builds, and fix what breaks. Use SDKs/CLIs/MCP over manual steps — it's faster and scores on "Actions & Tool Use." Use your strongest mode for backend work.
- **Cowork (Claude in Terri's desktop app) = architect + browser + deliverables.** It scaffolds/writes frontend files into this repo, drives web dashboards (Vercel import, Stripe, Exa, AWS console verification), runs research, and builds the pitch deck, demo script, and landing/funnel copy. It cannot type into the Terminal — that's why you exist.
- **Coordination rule:** *You own the repo + terminal as source of truth.* Cowork writes files to disk and hands them to you; **never edit the same file at the same moment.** Commit frequently with clear messages so Cowork can pull context from git. When you finish a unit of work, print a one-line status Terri can relay to Cowork.

## Tech stack & architecture (lean, optimized for 34h)
**Frontend (Vercel):** Next.js 15 App Router + Tailwind v4. Vercel **AI SDK** (`ai`, `@ai-sdk/react`) + **AI Gateway** (`AI_GATEWAY_API_KEY`). Browser Web Speech API for STT (free). `MediaRecorder` for voice capture.

**Backend (AWS sandbox account):**
- **Lambda** — one function per agent (compute).
- **Amazon Bedrock (Claude)** — agent inference (the AI/ML endpoint judges check). Bedrock access is already enabled for this account (Claude Code via Bedrock).
- **DynamoDB** — Users, EstateProfiles, Tasks, Conversations (schemas in `docs/PROJECT_SPEC.md`).
- **S3** — voice samples, documents.
- **API Gateway** — HTTP endpoints the Next.js app calls.
- **Step Functions** — orchestrate the "after they pass" pipeline. *Only if time allows* — it's the Orchestration scoring play, not mandatory.

**External APIs:** **Exa** (institution/legal research), **Stripe** (payments/funnel), **ElevenLabs** (voice cloning + TTS — Terri's own account, free tier).

> Note: the frontend conversational layer uses Vercel AI Gateway; the backend agents call Bedrock directly via the AWS SDK so Bedrock usage shows up in the AWS account. Both mandatory boxes are satisfied and independently verifiable.

## Repo conventions
- Secrets live in `.env.local` (gitignored) and in Vercel/Lambda env — **never commit keys.** `.env.local.example` lists required vars.
- Keep the frontend at repo root (Vercel auto-detects). Put AWS backend in `aws/` (Lambdas, IaC). Use the AWS CLI or a lightweight IaC (SAM/CDK) — your call, optimize for speed and verifiability.
- Don't over-engineer. Hardcode where it's faster, skip auth if it saves time, use env vars liberally. This is a 36h demo, not production.

## Current status
- ✅ Next.js scaffold built and running locally (Next 15.5.19). Landing page + `/companion` chat + `/api/chat` (AI Gateway) in place.
- ✅ Public GitHub repo created (empty): https://github.com/terrichan-git/willow
- ⏳ **Your first task:** push this repo (see the starter prompt Terri pastes).
- Next: Vercel deploy (Cowork drives in browser) + AI Gateway key → then **Phase 2: Institution Researcher on AWS (Bedrock + Lambda + Exa)**.

## Build plan (reprioritized for impact)
1. **Foundation** (in progress): repo, Vercel live URL, AWS resources (DynamoDB/S3), Bedrock check, Stripe products, Exa key, ElevenLabs voice clone.
2. **Institution Researcher** (the differentiator) — Lambda + Bedrock + Exa. Build first.
3. **Estate setup flow** — Stripe $9 checkout → conversational onboarding → DynamoDB → voice recording → ElevenLabs clone.
4. **Companion** (emotional core) — STT → Lambda(Bedrock, companion prompt + estate context) → ElevenLabs TTS → audio in browser. Non-negotiable for the demo.
5. **Dashboard + orchestration** — task timeline, Step Functions, Financial Settler (Stripe), Legal Guide (Exa), human-in-the-loop approvals.
6. **Revenue agent + polish** — ad copy (Bedrock), Stripe payment links, v0 UI polish.
7. **Demo prep** — screen recording, submission.

**If behind, cut in this order:** keep Institution Researcher + Companion voice + Stripe payment + AWS + Vercel; then estate flow/dashboard/Step Functions; cut revenue agent, Legal Guide, subscription analysis last. The companion voice conversation + institution research + a working payment is enough to win with a strong demo.

## Reference docs (read when relevant)
- `docs/PROJECT_SPEC.md` — architecture, DynamoDB schemas, Stripe products, file structure.
- `docs/AGENT_PROMPTS.md` — full system prompts for all 6 agents (use verbatim in Lambdas; the Companion prompt is staged in `lib/prompts.ts`).
- `docs/CLAUDE_COWORK_HANDOFF.md` — full background, user flows, demo script.
