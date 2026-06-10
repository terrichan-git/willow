// Extracts a structured estate profile from the onboarding transcript (via AI Gateway)
// and persists it to DynamoDB willow-EstateProfiles. Lean schema — high-value sections only.
import { generateObject } from "ai";
import { z } from "zod";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { PROFILE_EXTRACTION } from "@/lib/prompts";
import { randomUUID } from "crypto";

export const maxDuration = 30;

const MODEL = "anthropic/claude-sonnet-4.5";
const REGION = process.env.AWS_REGION || "us-west-2";
const TABLE = process.env.ESTATE_TABLE || "willow-EstateProfiles";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }), {
  marshallOptions: { removeUndefinedValues: true },
});

const ProfileSchema = z.object({
  personalInfo: z.object({
    name: z.string().nullable(),
    jurisdiction: z.string().nullable(),
    familyMembers: z.array(z.object({ name: z.string(), relationship: z.string().nullable() })),
  }),
  financialAccounts: z.array(
    z.object({ institution: z.string(), type: z.string().nullable(), value: z.string().nullable() })
  ),
  insurancePolicies: z.array(
    z.object({ provider: z.string(), type: z.string().nullable(), policyNumber: z.string().nullable() })
  ),
  wishes: z.object({ message: z.string().nullable(), voiceNotePlaceholder: z.boolean() }),
});

type UIMessage = { role: string; parts?: { type: string; text?: string }[]; content?: string };

function transcriptOf(messages: UIMessage[]): string {
  return messages
    .map((m) => {
      const text = m.parts?.filter((p) => p.type === "text").map((p) => p.text).join(" ") ?? m.content ?? "";
      return `${m.role === "user" ? "Person" : "Legacy Builder"}: ${text}`;
    })
    .filter((l) => l.trim().length > 6)
    .join("\n");
}

export async function POST(req: Request) {
  const { messages = [], userId } = await req.json();
  const transcript = transcriptOf(messages);
  if (!transcript) return Response.json({ error: "No conversation to save yet." }, { status: 400 });

  try {
    const { object: profile } = await generateObject({
      model: MODEL,
      system: PROFILE_EXTRACTION,
      schema: ProfileSchema,
      prompt: `Extract the estate profile from this onboarding conversation:\n\n${transcript}`,
    });

    const id = userId || `user-${randomUUID().slice(0, 8)}`;
    const item = {
      userId: id,
      sk: "profile",
      ...profile,
      status: "setup",
      plan: "readiness",
      updatedAt: new Date().toISOString(),
    };
    await ddb.send(new PutCommand({ TableName: TABLE, Item: item }));

    return Response.json({ ok: true, userId: id, profile });
  } catch (err) {
    return Response.json({ error: `Could not save profile: ${(err as Error).message}` }, { status: 500 });
  }
}
