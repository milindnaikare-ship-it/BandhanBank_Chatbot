import { Pinecone } from "@pinecone-database/pinecone";
import Anthropic from "@anthropic-ai/sdk";

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { userMessage, messages, system, max_tokens = 1000 } = req.body;

  try {
    // 1. Embed the user query
    const embedResponse = await pc.inference.embed(
      "multilingual-e5-large",
      [userMessage],
      { inputType: "query", truncate: "END" }
    );
    const queryVector = embedResponse[0].values;

    // 2. Search Pinecone
    const index = pc.index(process.env.PINECONE_INDEX_NAME || "bandhan-kb");
    const searchResult = await index.namespace("bandhan-kb").query({
      vector: queryVector,
      topK: 5,
      includeMetadata: true,
    });

    // 3. Build context
    const ragContext = searchResult.matches
      .filter((m) => m.score > 0.3)
      .map((m) => m.metadata.text)
      .join("\n\n---\n\n");

    // 4. Call Claude Haiku
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
