// Institution Researcher proxy.
//
// Primary path: invoke the AWS Lambda directly via the SDK (signed SigV4). This is
// what we use, because the hackathon AWS account's SCP blocks unauthenticated Lambda
// Function URLs (public URL returns 403). The SDK invoke uses the AWS creds from the
// environment / ~/.aws and is allowed by the participant role.
//
// Fallback path: if INSTITUTION_RESEARCHER_URL is set and SDK creds are absent, POST to
// the Function URL instead (useful if deployed to an account without the SCP).
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

export const maxDuration = 60;

const FUNCTION_NAME = process.env.INSTITUTION_RESEARCHER_FN || "institutionResearcher";
const REGION = process.env.AWS_REGION || "us-west-2";

const lambda = new LambdaClient({ region: REGION });

export async function POST(req: Request) {
  const body = await req.json();
  if (!body?.institutionName) {
    return Response.json({ error: "institutionName is required" }, { status: 400 });
  }

  try {
    const res = await lambda.send(
      new InvokeCommand({
        FunctionName: FUNCTION_NAME,
        Payload: Buffer.from(JSON.stringify(body)),
      })
    );
    const text = new TextDecoder().decode(res.Payload);
    const data = JSON.parse(text || "{}");
    if (res.FunctionError) {
      return Response.json({ error: `Lambda error: ${data?.errorMessage || res.FunctionError}` }, { status: 502 });
    }
    return Response.json(data, { status: 200 });
  } catch (err) {
    // Fallback to the Function URL if configured.
    const url = process.env.INSTITUTION_RESEARCHER_URL;
    if (url) {
      try {
        const r = await fetch(url, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        });
        return Response.json(await r.json(), { status: r.status });
      } catch {
        /* fall through to error below */
      }
    }
    return Response.json(
      { error: `Could not invoke the researcher Lambda: ${(err as Error).message}. Check AWS credentials.` },
      { status: 502 }
    );
  }
}
