// Proxies the Institution Researcher request to the AWS Lambda Function URL.
// Keeps the Lambda URL server-side and gives the browser a same-origin endpoint.
export const maxDuration = 60;

export async function POST(req: Request) {
  const url = process.env.INSTITUTION_RESEARCHER_URL;
  if (!url) {
    return Response.json(
      { error: "INSTITUTION_RESEARCHER_URL is not set. Deploy the Lambda and add its Function URL to the env." },
      { status: 500 }
    );
  }

  const body = await req.json();
  if (!body?.institutionName) {
    return Response.json({ error: "institutionName is required" }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (err) {
    return Response.json(
      { error: `Failed to reach the researcher Lambda: ${(err as Error).message}` },
      { status: 502 }
    );
  }
}
