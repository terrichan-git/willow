import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { WILLOW_GUIDE } from "@/lib/prompts";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Model is routed through the Vercel AI Gateway (uses AI_GATEWAY_API_KEY).
// Format is "provider/model". Swap freely without code changes elsewhere.
const MODEL = "anthropic/claude-sonnet-4.5";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: MODEL,
    system: WILLOW_GUIDE,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
