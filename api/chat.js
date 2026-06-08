export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { system, messages, max_tokens = 1000 } = req.body;

  // Convert Anthropic-style {role, content} messages to OpenAI format
  const openAiMessages = [
    { role: "system", content: system },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  try {
    const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GLM_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.GLM_MODEL_ID || "glm-4-flash",
        messages: openAiMessages,
        max_tokens,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("GLM error:", data);
      return res.status(response.status).json({ error: data.error?.message || "GLM API error" });
    }

    // Return in Anthropic-compatible shape so the frontend works unchanged
    const text = data.choices?.[0]?.message?.content || "";
    res.status(200).json({ content: [{ type: "text", text }] });
  } catch (err) {
    console.error("Handler error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
}
