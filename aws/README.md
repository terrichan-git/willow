# Willow — AWS backend

Agents run on **AWS** (the judged "infra runs the agents" requirement): agent logic on
**Lambda**, inference on **Bedrock (Claude Sonnet 4.6)**, data in **DynamoDB**, files in **S3**.

## Institution Researcher (Agent 2)

`agents/institutionResearcher/index.mjs` — zero-dependency Node 20 Lambda.

Pipeline: **Exa** (real-time web research) → **Bedrock / Claude Sonnet 4.6** (structures the
research into strict JSON — this is the AWS AI/ML step) → **DynamoDB `willow-Tasks`** (persisted).

- **Input:** `{ institutionName, type, jurisdiction, estateId? }`
- **Output:** `{ notificationProcess, requiredDocuments[], timeline, financialImplications, notes[], sources[], confidence, needsManualResearch, meta }`
- **Failure handling:** thin Exa results → query is broadened once → if still thin, `needsManualResearch:true`.

## Deploy

Provisions DynamoDB (Users, EstateProfiles, Tasks, Conversations), an S3 bucket, the IAM role
(incl. the Bedrock marketplace-subscribe statement from `CLAUDE.md`), the Lambda, and a public
Function URL. Idempotent.

```bash
EXA_API_KEY=xxx \
BEDROCK_MODEL_ID=us.anthropic.claude-sonnet-4-6-20250930-v1:0 \
./aws/scripts/deploy.sh
```

The printed **Function URL** goes into Willow's env as `INSTITUTION_RESEARCHER_URL`
(`.env.local` locally, Vercel project env for production).

## Resources

| Resource | Name |
|----------|------|
| Lambda | `institutionResearcher` (nodejs20.x) |
| IAM role | `willow-institutionResearcher-role` |
| DynamoDB | `willow-Users`, `willow-EstateProfiles`, `willow-Tasks`, `willow-Conversations` |
| S3 | `willow-assets-<accountId>-<region>` |
| Region | `us-west-2` |
