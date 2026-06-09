# HANDOFF: Digital Estate Agent — SuperAI NEXT Hackathon

## For Claude Cowork — Read This Entire Document Before Starting

---

## WHO IS TERRI

Terri Chan is a solo hackathon participant at the SuperAI NEXT Hackathon (Marina Bay Sands, Singapore). She works at HealthMetrics (healthcare benefits platform for SMEs in Malaysia/Singapore) in a marketing/growth leadership role. She has deep knowledge of healthcare systems, insurance, claims processing, and B2B/B2C go-to-market.

### Terri's Skills
- Marketing & growth (Meta Ads, ascension funnels, content strategy)
- AI tools power user (Claude Max, Codex/ChatGPT, Canva, Airtable, v0, Dia browser)
- Basic technical literacy but NOT a full-stack developer — she needs guidance on code implementation
- Has been building an AI agent system called "Hermes" (Revenue Engine) using Claude Code
- Deep knowledge of faceless YouTube content creation tools and workflows
- Knows healthcare/insurance industry inside-out

### Terri's Available Tools & Accounts
- Claude Max subscription (Claude Code access)
- OpenAI Codex / ChatGPT paid plan
- Airtable paid plan
- ElevenLabs account (needs to set up — free tier is sufficient for demo)
- Meta Business Suite access (for running ads)
- Personal Mac laptop

### Hackathon Credits (being claimed now)
- AWS: Temporary sandbox account with full service access + 500 Kiro credits
- Vercel: $30 in v0 credits + $15 in AI Gateway credits
- Exa: $100 in credits + API key
- Stripe: $250 in credits
- Dify: 1-month Pro subscription

---

## THE HACKATHON

### Key Facts
- **Event**: SuperAI NEXT Hackathon
- **Location**: Marina Bay Sands, Singapore
- **Duration**: 36 hours (hacking started 12:00pm, 9 June 2026)
- **Current time**: ~2:10pm, 9 June 2026 (~34 hours remaining)
- **Submission deadline**: 11:59pm, 10 June 2026
- **Team size**: Solo (just Terri)
- **Theme**: "Build anything — but make it agentic"
- **Top 5 demo**: Live on WEKA stage in front of 10,000 attendees

### Submission Requirements
1. **GitHub repo** — public, or with judge access granted
2. **Project link** — live URL or hosted demo
3. **Presentation slides** — Google Drive link to .ppt or .keynote file
   - .ppt or .keynote ONLY (no Google Slides, no Gamma, no web links)
   - Screen recordings for demos (live demos prohibited on stage)
   - Embed videos directly in slides (no YouTube links)
   - Slides are locked at submission — no changes after deadline

### MANDATORY Requirements for Top 5
1. **AWS infrastructure deployments** — judges will verify agents run on AWS services (compute, databases, AI/ML endpoints) — not just calling external APIs
2. **Vercel integration** — at least one of: AI Gateway, AI SDK (Sandbox), AI SDK (Workflows)

### Additional Prize Categories (can stack with Top 5)
- **Best use of Exa** ($1,500 × top 3 teams) — selected by Exa team
- **Best use of Stripe** ($1,000 × top 3 teams) — selected by Stripe team

### Judging Criteria
1. **Agent Overview** — What agent(s) did you build? What is their purpose?
2. **Autonomy & Decision-Making** — How does your agent decide what to do next? Reasoning, planning, tool-use patterns?
3. **Actions & Tool Use** — What actions can your agent take? What tools/APIs/environments does it interact with?
4. **Orchestration** — If multi-agent: how do agents coordinate, delegate, or communicate?
5. **Human-in-the-Loop** — Where does a human intervene, approve, or override?
6. **Failure Handling** — How does your agent recover from errors or unexpected states?
7. **Demo & Presentation** — Clarity of pitch, quality of demo/product, communication

---

## WHAT WE'RE BUILDING

### Product: Digital Estate Agent (name TBD — Terri hasn't decided yet, suggest options)

### One-Liner
An agentic platform that helps people prepare their digital estate while alive, then activates an AI companion — speaking in their cloned voice — to guide loved ones through everything that needs to happen after they pass.

### Why This Wins
1. **Unique**: Zero chance another team builds this. Most teams will build sales agents, chatbots, or coding tools.
2. **Emotionally powerful**: The cloned voice companion demo will silence a room of 10,000 people.
3. **Real business**: Ascension funnel (tripwire $9 → core $79 → subscription $149/yr) with Meta Ads driving traffic. Goal: generate actual revenue during the hackathon.
4. **Genuine agentic complexity**: 6 agents orchestrated via AWS Step Functions, using canonical data (legal requirements, institution-specific procedures), handling drift (regulations change, processes update), with governance (audit trails, human approvals).
5. **Large underserved market**: $84T wealth transfer happening, 60%+ adults have no estate plan. Current options: $2K-5K lawyers or DIY templates. Nothing agentic exists.
6. **All sponsor tools used deeply**: AWS (infra), Vercel (frontend + AI SDK), Exa (institution research), Stripe (payments + financial settlements), ElevenLabs (voice companion).

### The Emotional Core — CRITICAL
The demo centerpiece is a TWO-WAY CONVERSATION between a bereaved family member and the AI companion speaking in their deceased loved one's cloned voice. This is NOT a chatbot. It should feel like a phone call with someone who is gone but left behind their knowledge and love.

Key emotional moments to design for:
- Family member says "I miss you so much" → Companion responds with warmth, uses their specific phrases and nicknames, acknowledges the grief BEFORE transitioning to practical help
- Family member asks "What do I do about the house?" → Companion gives SPECIFIC guidance ("The title deed is in the blue folder in my bedroom cabinet. You'll need to bring it to the land office with my death certificate.")
- Family member is overwhelmed → Companion says "Hey, take a breath. I organized everything so you wouldn't have to figure it all out alone."

The person set this up WHILE ALIVE. They chose to do this. They recorded their voice. They wrote their personality context. They specified what to share and when. This is a digital letter from beyond — one that can answer questions.

---

## ARCHITECTURE

```
User → Vercel (Next.js + AI SDK Workflows)
         ↓
    AWS API Gateway
         ↓
    AWS Step Functions (Orchestrator)
         ↓
    ┌──────────┬──────────┬──────────┬──────────┐
    Lambda:    Lambda:    Lambda:    Lambda:    Lambda:
    Legacy     Institution Legal     Financial  Companion
    Builder    Researcher  Guide     Settler    (ElevenLabs)
    (Bedrock)  (Exa)      (Exa)     (Stripe)   (Bedrock)
    ↓          ↓          ↓         ↓          ↓
    DynamoDB   Exa API    Exa API   Stripe API ElevenLabs
                                               API
         ↓
    Revenue Agents (separate Step Function)
    ├── Ad Copy Agent (Bedrock)
    ├── Audience Research Agent (Exa)
    └── Payment Agent (Stripe Payment Links)
```

### Tech Stack Detail

**Frontend**:
- Next.js 14+ (App Router)
- Vercel AI SDK (Workflows) — for multi-step agent interactions
- Vercel AI Gateway — for LLM routing
- TailwindCSS for styling
- Browser Web Speech API for speech-to-text (FREE, no API needed)
- Deploy on Vercel

**Backend**:
- AWS Lambda — one function per agent
- AWS Step Functions — orchestration (visual DAG, built-in retry/error handling)
- AWS API Gateway — HTTP endpoints
- Amazon DynamoDB — user data, estate profiles, tasks, conversations
- Amazon S3 — voice recordings, documents
- Amazon Bedrock (Claude) — LLM inference

**External APIs**:
- Exa — web search for institution research, legal requirements
- Stripe — Checkout, Billing, Payment Links, Webhooks
- ElevenLabs — Instant Voice Cloning + Text-to-Speech

---

## AGENTS (6 total)

### Agent 1: Legacy Builder
- **Purpose**: Guides user through estate setup via conversation
- **Input**: User responses during onboarding
- **Output**: Structured estate profile in DynamoDB
- **Tools**: Bedrock (Claude), Exa (jurisdiction research)
- **System prompt**: See AGENT_PROMPTS.md

### Agent 2: Institution Researcher
- **Purpose**: Finds specific notification/claim procedures for each institution
- **Input**: Institution name + type (bank, insurer, utility, etc.)
- **Output**: Step-by-step procedure, required documents, contact info, deadlines
- **Tools**: Exa (web search)
- **Example query**: "How to notify DBS Bank Singapore of account holder death process required documents"

### Agent 3: Legal Guide
- **Purpose**: Researches probate and estate law for user's jurisdiction
- **Input**: Jurisdiction, estate value, asset types
- **Output**: Legal requirements, document checklists, timeline
- **Tools**: Exa (legal research)

### Agent 4: Financial Settler
- **Purpose**: Identifies and manages recurring financial obligations
- **Input**: User's subscription/payment list from estate profile
- **Output**: Cancellation instructions, refund tracking, savings calculation
- **Tools**: Stripe (payment management)

### Agent 5: Companion
- **Purpose**: Two-way conversational AI in the deceased's cloned voice
- **Input**: Family member's spoken words (speech-to-text via browser)
- **Output**: Audio response in cloned voice with practical guidance + emotional warmth
- **Tools**: Bedrock (Claude) for response, ElevenLabs for TTS
- **Critical**: This is the emotional centerpiece. See detailed prompt in AGENT_PROMPTS.md.

### Agent 6: Revenue Agent
- **Purpose**: Autonomously markets the product via Meta Ads
- **Input**: Product details, target audience
- **Output**: Ad copy, audience targeting suggestions, Stripe payment links
- **Tools**: Exa (audience research), Stripe (payment link generation)

---

## DATA MODEL (DynamoDB)

### Table: Users
- PK: userId
- email, name, jurisdiction, createdAt
- stripeCustomerId
- plan: "free" | "readiness" | "full" | "family"

### Table: EstateProfiles
- PK: userId, SK: "profile"
- personalInfo: { name, dob, jurisdiction, familyMembers[] }
- financialAccounts: [{ institution, type, accountRef, notes }]
- insurancePolicies: [{ provider, type, policyNumber, beneficiaries }]
- digitalAccounts: [{ platform, username, notes }]
- subscriptions: [{ service, amount, frequency, paymentMethod }]
- propertyAssets: [{ type, description, location, documents }]
- wishes: { messages: [{ recipient, message }], instructions: string }
- voiceCloneId: string (ElevenLabs voice ID)
- personalityContext: string
- status: "setup" | "active" | "activated"

### Table: Tasks
- PK: estateId, SK: taskId
- category: "immediate" | "7day" | "30day" | "90day"
- institution, action, requiredDocs[], deadline
- status: "pending" | "in_progress" | "completed"
- researchResult: object (Exa output)

### Table: Conversations
- PK: estateId, SK: timestamp
- speaker: "companion" | "family_member"
- text: string, audioUrl: string (S3 path)

---

## MONETIZATION — ASCENSION FUNNEL

| Stage | Product | Price | Trigger |
|---|---|---|---|
| Lead Magnet | "Are You Prepared?" quiz | Free | Email capture |
| Tripwire | Estate Readiness Report | $9 | Agent generates gap analysis |
| Order Bump | Digital Will Generator | +$19 | AI-generated basic will |
| Core Offer | Full Estate Plan + AI Companion | $79 | Voice cloning, full agent access |
| Upsell | Family Protection Plan (annual) | $149/yr | Ongoing monitoring, multi-member |
| Downsell | Estate Checklist Pack | $29 | Templates without AI companion |

Goal: Generate real revenue DURING the hackathon via Stripe. Show judges the live Stripe dashboard with actual transactions.

Terri can run Meta Ads from her Meta Business Suite to drive traffic to the tripwire during the hackathon.

---

## USER FLOWS

### Flow 1: "While You're Alive" — Estate Setup
1. User lands on site → takes free "Are You Prepared?" quiz
2. Quiz reveals gaps → CTA to $9 Estate Readiness Report (Stripe Checkout)
3. After payment → conversational onboarding begins (Vercel AI SDK Workflows):
   - Personal details, family members
   - Financial accounts (banks, investments)
   - Insurance policies
   - Digital accounts and subscriptions
   - Property and assets
   - Wishes and messages for loved ones
4. User records 30-second voice sample → ElevenLabs clones voice
5. User writes personality context (how they speak, nicknames for family, values)
6. Agent generates Estate Readiness Report (Exa researches jurisdiction requirements)
7. Upsell to Full Estate Plan ($79)

### Flow 2: "After They Pass" — Companion Activation
1. Executor/family member logs in with access code (provided during setup)
2. Uploads death certificate → S3
3. AI Companion activates in deceased's cloned voice
4. Dashboard shows prioritized task timeline:
   - Immediate (24h): Notify employer, secure property, contact funeral services
   - 7-day: Notify banks, insurers, file claims
   - 30-day: Cancel subscriptions, transfer utilities
   - 90-day: Probate, property transfer, tax filing
5. For each institution → Institution Researcher agent finds exact process via Exa
6. Financial Settler identifies active subscriptions → helps cancel via Stripe
7. Legal Guide researches probate requirements via Exa

### Flow 3: Companion Conversation (the WOW moment)
1. Family member clicks "Talk to [Name]"
2. Browser Web Speech API captures their spoken words → text
3. Text sent to Lambda → Bedrock/Claude with system prompt including personality + estate context
4. LLM generates response in character
5. Response text sent to ElevenLabs TTS API with cloned voice ID
6. Audio streams back to browser → plays through speaker
7. Continuous two-way conversation

---

## BUILD PLAN — PRIORITY ORDER

Terri is SOLO with ~34 hours left. Every feature must justify its time investment. Build in order of impact.

### Phase 1: Foundation (Hours 1-3) — DO FIRST
- [ ] Initialize Next.js project, install dependencies
- [ ] Deploy to Vercel (get live URL early — required for submission)
- [ ] Set up AWS resources: DynamoDB tables, S3 bucket, first Lambda function
- [ ] Set up Stripe: create products, prices, and checkout session
- [ ] Set up Exa: test API key with a sample query
- [ ] Set up ElevenLabs: create account, clone voice, get API key
- [ ] Create GitHub repo (required for submission)

### Phase 2: Core Agent — Institution Researcher (Hours 3-5)
This is the differentiator. Build it first.
- [ ] Lambda function that takes institution name + type
- [ ] Calls Exa API with targeted queries
- [ ] Parses results into structured notification process
- [ ] Returns: steps, documents needed, contacts, deadlines
- [ ] Test with real institutions: DBS Bank Singapore, AIA Insurance, Netflix

### Phase 3: Estate Setup Flow (Hours 5-8)
- [ ] Landing page with value proposition
- [ ] Stripe Checkout integration ($9 tripwire)
- [ ] Conversational onboarding using Vercel AI SDK Workflows
- [ ] Save estate profile to DynamoDB
- [ ] Voice recording component (MediaRecorder API in browser)
- [ ] Send voice to ElevenLabs for cloning, save voiceCloneId

### Phase 4: Companion — The Emotional Core (Hours 8-12)
- [ ] Companion chat page with speech-to-text (Web Speech API)
- [ ] Lambda function: receives text → calls Bedrock with companion prompt + estate context
- [ ] Lambda calls ElevenLabs TTS with cloned voice ID
- [ ] Audio response plays in browser
- [ ] Test the full conversation loop end-to-end
- [ ] Refine the companion prompt for emotional authenticity

### Phase 5: Dashboard + Orchestration (Hours 12-16)
- [ ] Task timeline dashboard (immediate / 7-day / 30-day / 90-day)
- [ ] Step Functions definition connecting all agents
- [ ] Financial Settler agent (Stripe subscription analysis)
- [ ] Legal Guide agent (Exa probate research)
- [ ] Human-in-the-loop: approval buttons for financial actions

### Phase 6: Revenue Agents + Polish (Hours 16-20)
- [ ] Revenue Agent: generate ad copy using Bedrock
- [ ] Revenue Agent: audience research via Exa
- [ ] Revenue Agent: create Stripe Payment Links
- [ ] UI polish with v0 (use $30 credits)
- [ ] Error handling and edge cases
- [ ] If time: set up a real Meta ad with the generated copy

### Phase 7: Demo Prep + Submission (Hours 20-24)
- [ ] Record screen demo of full flow (estate setup → companion conversation)
- [ ] Create .ppt slides (NOT Google Slides — .ppt or .keynote ONLY)
- [ ] Embed screen recording in slides
- [ ] Test live URL works
- [ ] Push final code to GitHub
- [ ] Submit on DoraHacks: GitHub link, live URL, slides link (Google Drive)
- [ ] Double-check AWS deployment is running (judges verify this)

### SCOPE MANAGEMENT — WHAT TO CUT IF BEHIND
If running out of time, prioritize in this order:
1. MUST HAVE: Institution Researcher (Exa) + Companion voice (ElevenLabs) + Stripe payment + deployed on AWS + Vercel
2. NICE TO HAVE: Full estate setup flow, task dashboard, Step Functions orchestration
3. CAN SKIP: Revenue agents, Meta ads integration, Legal Guide, subscription analysis

The companion voice conversation + institution research + working payment is enough to win if the demo is strong.

---

## DEMO SCRIPT (3 minutes)

### Opening (30 sec)
"When someone you love dies, you're hit with the worst grief of your life — AND a mountain of paperwork. Which bank to call. Which insurance to claim. Which subscriptions are still charging. 60% of families have no plan for this. Today, I built something that changes that."

### Estate Setup (45 sec)
Show the setup flow: "While alive, you create your digital estate. You tell the system about your accounts, your insurance, your wishes. And then you do something extraordinary — you record your voice."
[Show voice recording, quick estate form]

### The Companion (90 sec) — THIS IS THE MOMENT
"Six months later, your daughter Emma logs in."
[Show the companion activating]

Emma: "Mom? I don't know what to do. Everything is overwhelming."
Mom's AI (cloned voice): "Hi sweetheart. Take a breath. I'm here. I organized everything before so you wouldn't have to figure this out alone. Let's start with what's most urgent..."

Emma: "I miss you so much."
Mom's AI: "Oh baby... I miss you too. More than you know. But I'm so proud of you. Now — your first step is the life insurance with Prudential. I've already prepared what you need..."

[Show the agent pulling real data via Exa — DBS notification process, Prudential claim procedure]
[Show Stripe cancelling subscriptions, tracking savings]

### The Business (15 sec)
"This isn't a demo. It's live. It has paying users. Here's the Stripe dashboard."
[Flash Stripe dashboard showing real transactions]

### Close (15 sec)
"The people we love shouldn't leave us with chaos. They should leave us with clarity. That's what [Product Name] does."

---

## REFERENCE FILES

Two additional files exist in the work directory:
- `PROJECT_SPEC.md` — Detailed project specification
- `AGENT_PROMPTS.md` — Complete system prompts for all 6 agents

These contain the full agent prompt text that should be used in the Lambda functions.

---

## IMPORTANT NOTES FOR CLAUDE COWORK

1. **Terri is not a professional developer.** Guide her step by step. Don't assume she knows how to set up AWS services from scratch. Provide exact commands and console steps.

2. **Time is the enemy.** Every suggestion should be the FASTEST path to a working feature. Prefer managed services over custom implementations. Use v0 for UI generation. Use existing templates when possible.

3. **The companion voice is non-negotiable.** If only one feature works in the demo, it must be the two-way voice conversation with the cloned voice. Everything else is supporting material.

4. **AWS infrastructure must be real.** Judges will verify. Lambda functions, DynamoDB tables, S3 buckets must exist and be used. Don't fake it with local servers.

5. **Vercel integration must use AI SDK or AI Gateway.** Just deploying a Next.js app on Vercel is not enough. Must use at least one of: AI Gateway, AI SDK (Sandbox), AI SDK (Workflows).

6. **Slides must be .ppt or .keynote.** Not Google Slides. Not web links. Screen recordings should be embedded directly (not YouTube links).

7. **The product should generate real revenue.** Set up Stripe Checkout with real pricing. Even one $9 transaction during the hackathon proves the business is real.

8. **ElevenLabs is not a sponsor.** Terri uses her own account. Free tier should be sufficient for the demo (instant voice cloning + ~10,000 characters TTS).

9. **Don't over-engineer.** This is a 36-hour hackathon, not a production system. Hardcode where it's faster. Skip auth if it saves time. Use environment variables liberally. The goal is a working demo that proves the concept.

10. **Terri has good product instincts.** She'll push back if something feels wrong. Trust her judgment on UX, copy, and go-to-market. She knows her audience.
