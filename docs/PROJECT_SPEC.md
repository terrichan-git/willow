# Digital Estate Agent — Hackathon Project Spec

## Product Name: [TBD]

## One-Liner
An agentic platform that helps people prepare their digital estate while alive, then activates an AI companion (in their cloned voice) to guide loved ones through everything that needs to happen after they pass.

## Hackathon: SuperAI NEXT Hackathon
- Duration: 36 hours
- Theme: "Build anything — but make it agentic"
- Solo builder
- Submission deadline: 11:59pm, 10 June 2026

## Required Integrations
1. **AWS** — Lambda, Step Functions, DynamoDB, S3, Bedrock (judges verify AWS infra)
2. **Vercel** — Next.js frontend + AI SDK Workflows (required for Top 5)
3. **Exa** — Institution research, legal requirements, subscription discovery
4. **Stripe** — Payment processing, subscription management, ascension funnel

## Additional Integrations
- **ElevenLabs** — Voice cloning + TTS for companion

---

## Architecture

### Frontend (Vercel)
- Next.js 14+ App Router
- Vercel AI SDK for streaming agent conversations
- Deployed on Vercel

### Backend (AWS)
- API Gateway → Lambda functions (one per agent)
- Step Functions for orchestration
- DynamoDB for data storage
- S3 for voice recordings and documents
- Bedrock (Claude) for LLM inference

### External APIs
- Exa for web research
- Stripe for payments
- ElevenLabs for voice

---

## User Flows

### Flow 1: "While You're Alive" — Estate Setup
1. User signs up (Stripe Checkout — $9 tripwire for Estate Readiness Report)
2. Conversational onboarding (Vercel AI SDK Workflows):
   - Personal details (name, jurisdiction, family members)
   - Financial accounts (banks, investments, crypto)
   - Insurance policies (life, health, property)
   - Digital accounts (email, social media, subscriptions)
   - Property and assets
   - Important documents and their locations
   - Wishes and messages for loved ones
3. Voice recording (30-second sample for ElevenLabs voice clone)
4. Agent generates Estate Readiness Report (Exa researches jurisdiction requirements)
5. Upsell to full estate plan ($79) — will generator, companion setup

### Flow 2: "After They Pass" — Companion Activation
1. Executor/family member logs in with access code
2. Uploads death certificate (S3)
3. AI Companion activates (cloned voice of deceased)
4. Companion guides through:
   - Immediate actions (24 hours)
   - Short-term actions (7 days)
   - Medium-term actions (30 days)
   - Long-term actions (90 days)
5. For each institution:
   - Institution Researcher agent (Exa) finds specific notification process
   - Generates checklist with required documents
   - Provides contact info, forms, deadlines
6. Financial Settler agent (Stripe) identifies recurring charges, helps cancel
7. Legal Guide agent (Exa) researches probate requirements

### Flow 3: Companion Conversation
1. Family member speaks to companion (browser Web Speech API → text)
2. Text sent to Lambda → Bedrock with personality context
3. LLM generates response
4. Response sent to ElevenLabs TTS (cloned voice)
5. Audio streams back to browser
6. Two-way conversation in the voice of the deceased

---

## Agent Definitions

### Agent 1: Legacy Builder
- Purpose: Guides user through estate setup via conversation
- Input: User responses during onboarding
- Output: Structured estate profile in DynamoDB
- Tools: Bedrock (Claude) for conversation, Exa for jurisdiction research

### Agent 2: Institution Researcher
- Purpose: Finds specific notification/claim procedures for each institution
- Input: Institution name + type (bank, insurer, utility, etc.)
- Output: Step-by-step procedure, required documents, contact info, deadlines
- Tools: Exa (web search for institution-specific processes)

### Agent 3: Legal Guide
- Purpose: Researches probate and estate law for user's jurisdiction
- Input: Jurisdiction, estate value, asset types
- Output: Legal requirements, document checklists, timeline
- Tools: Exa (legal requirement research)

### Agent 4: Financial Settler
- Purpose: Identifies and manages recurring financial obligations
- Input: User's subscription/payment list from estate profile
- Output: Cancellation status, refund tracking, settlement processing
- Tools: Stripe (payment management)

### Agent 5: Companion
- Purpose: Two-way conversational AI in the deceased's cloned voice
- Input: Family member's spoken words (speech-to-text)
- Output: Audio response in cloned voice with practical guidance + emotional warmth
- Tools: Bedrock (Claude) for response generation, ElevenLabs for TTS
- Context: Personality profile, estate details, family member info, wishes

### Agent 6: Revenue Agent (Meta)
- Purpose: Autonomously markets the product
- Input: Product details, target audience
- Output: Ad copy, audience targeting, payment links
- Tools: Exa (audience research), Stripe (payment link generation)

---

## Data Model (DynamoDB)

### Table: Users
- PK: userId
- email, name, jurisdiction, createdAt
- stripeCustomerId
- plan: "free" | "readiness" | "full" | "family"

### Table: EstateProfiles
- PK: userId
- SK: "profile"
- personalInfo: { name, dob, jurisdiction, familyMembers[] }
- financialAccounts: [{ institution, type, accountRef, notes }]
- insurancePolicies: [{ provider, type, policyNumber, beneficiaries }]
- digitalAccounts: [{ platform, username, notes }]
- subscriptions: [{ service, amount, frequency, paymentMethod }]
- propertyAssets: [{ type, description, location, documents }]
- wishes: { messages: [{ recipient, message }], instructions: string }
- voiceCloneId: string (ElevenLabs voice ID)
- personalityContext: string (how they speak, common phrases, values)
- status: "setup" | "active" | "activated"

### Table: Tasks
- PK: estateId
- SK: taskId
- category: "immediate" | "7day" | "30day" | "90day"
- institution: string
- action: string
- requiredDocs: string[]
- deadline: string
- status: "pending" | "in_progress" | "completed"
- researchResult: object (Exa research output)

### Table: Conversations
- PK: estateId
- SK: timestamp
- speaker: "companion" | "family_member"
- text: string
- audioUrl: string (S3)

---

## Stripe Products

### Tripwire
- Product: "Estate Readiness Report"
- Price: $9 one-time
- Trigger: Generate report via agent pipeline

### Core Offer
- Product: "Full Estate Plan + AI Companion"
- Price: $79 one-time
- Trigger: Unlock will generator, voice cloning, full agent access

### Subscription
- Product: "Family Protection Plan"
- Price: $149/year
- Trigger: Ongoing monitoring, annual review, multi-member access

---

## Judging Criteria Alignment

1. **Agent Overview**: 6 agents with clear, distinct purposes
2. **Autonomy & Decision-Making**: Agents decide which institutions to research, prioritize tasks by urgency, adapt responses based on jurisdiction
3. **Actions & Tool Use**: Exa search, Stripe payments, ElevenLabs voice, DynamoDB writes, S3 uploads
4. **Orchestration**: Step Functions visual pipeline — agents coordinate in sequence and parallel
5. **Human-in-the-Loop**: Family member approves financial actions, executor confirms task completion
6. **Failure Handling**: Exa search returns nothing → broaden query → try alternative sources → flag for manual research
7. **Demo & Presentation**: Cloned voice companion conversation is the emotional centerpiece

---

## File Structure

```
/
├── frontend/                  # Next.js app (Vercel)
│   ├── app/
│   │   ├── page.tsx          # Landing page
│   │   ├── setup/            # Estate setup flow
│   │   ├── companion/        # Companion conversation
│   │   ├── dashboard/        # Task dashboard
│   │   └── api/              # API routes
│   ├── components/
│   │   ├── VoiceRecorder.tsx
│   │   ├── CompanionChat.tsx
│   │   ├── TaskTimeline.tsx
│   │   └── EstateForm.tsx
│   └── lib/
│       ├── stripe.ts
│       └── agents.ts
├── backend/                   # AWS Lambda functions
│   ├── agents/
│   │   ├── legacyBuilder.ts
│   │   ├── institutionResearcher.ts
│   │   ├── legalGuide.ts
│   │   ├── financialSettler.ts
│   │   ├── companion.ts
│   │   └── revenueAgent.ts
│   ├── stepfunctions/
│   │   └── orchestrator.asl.json
│   └── lib/
│       ├── exa.ts
│       ├── elevenlabs.ts
│       └── bedrock.ts
└── docs/
    ├── PROJECT_SPEC.md
    └── AGENT_PROMPTS.md
```
