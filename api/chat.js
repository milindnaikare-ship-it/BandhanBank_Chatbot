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

    // 3. Call Claude Haiku with augmented system prompt
    const augmentedSystem = ragContext
      ? system + "\n\n## RELEVANT KNOWLEDGE BASE CONTEXT\n" + ragContext
      : system;

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens,
      system: augmentedSystem,
      messages,
    });

    res.status(200).json({ content: response.content });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
}
