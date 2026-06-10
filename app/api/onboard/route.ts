import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { LEGACY_BUILDER } from "@/lib/prompts";

export const maxDuration = 30;

// Onboarding conversation runs through the Vercel AI Gateway (AI_GATEWAY_API_KEY).
const MODEL = "anthropic/claude-sonnet-4.5";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: MODEL,
    system: LEGACY_BUILDER,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
