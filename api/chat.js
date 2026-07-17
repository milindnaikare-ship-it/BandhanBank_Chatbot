import { Pinecone } from "@pinecone-database/pinecone";
import Anthropic from "@anthropic-ai/sdk";

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { userMessage, messages, system, max_tokens = 1000 } = req.body;

  try {
    // 1. Search Pinecone using integrated inference (index embeds the query automatically)
    const index = pc.index(process.env.PINECONE_INDEX_NAME || "bandhan-kb");
    const searchResult = await index.namespace("bandhan-kb").searchRecords({
      query: { inputs: { text: userMessage }, topK: 5 },
      fields: ["text", "section"],
    });

    // 2. Build context from retrieved chunks
    const ragContext = (searchResult.result?.hits || [])
      .filter((h) => h._score > 0.3)
      .map((h) => h.fields?.text)
      .filter(Boolean)
      .join("\n\n---\n\n");

    // 3. Call Claude Haiku with augmented system prompt — stream via SSE
    const augmentedSystem = ragContext
      ? system + "\n\n## RELEVANT KNOWLEDGE BASE CONTEXT\n" + ragContext
      : system;

    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");

    const stream = anthropic.messages.stream({
      model: "claude-haiku-4-5-20251001",
      max_tokens,
      system: augmentedSystem,
      messages,
    });

    stream.on("text", (delta) => {
      res.write(`data: ${JSON.stringify({ delta })}\n\n`);
    });

    await stream.finalMessage();
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    console.error("Chat error:", err);
    // If headers already sent (mid-stream), surface the error as an SSE event
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: err.message || "stream error" })}\n\n`);
      res.end();
    } else {
      res.status(500).json({ error: err.message || "Internal server error" });
    }
  }
}
