import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    ...(process.env.AWS_SESSION_TOKEN && { sessionToken: process.env.AWS_SESSION_TOKEN }),
  },
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { system, messages, max_tokens = 1000 } = req.body;

  try {
    const payload = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens,
      system,
      messages,
    };

    const command = new InvokeModelCommand({
      modelId: process.env.BEDROCK_MODEL_ID || "anthropic.claude-3-5-sonnet-20241022-v2:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(payload),
    });

    const response = await client.send(command);
    const result = JSON.parse(new TextDecoder().decode(response.body));

    res.status(200).json(result);
  } catch (err) {
    console.error("Bedrock error:", err);
    res.status(500).json({ error: err.message || "Bedrock invocation failed" });
  }
}
