// scripts/ingest.js
import { Pinecone } from "@pinecone-database/pinecone";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __dirname = dirname(fileURLToPath(import.meta.url));

function chunkMarkdown(md) {
  const sections = md.split(/^## /m).filter(Boolean);
  const chunks = [];
  for (const section of sections) {
    const lines = section.split("\n");
    const header = "## " + lines[0].trim();
    const body = lines.slice(1).join("\n").trim();
    // Split long sections by paragraph
    const paragraphs = body.split(/\n\n+/).filter((p) => p.trim().length > 30);
    if (paragraphs.length <= 2 || body.length < 800) {
      chunks.push({ header, text: header + "\n\n" + body });
    } else {
      for (const para of paragraphs) {
        chunks.push({ header, text: header + "\n\n" + para });
      }
    }
  }
  return chunks;
}

async function main() {
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  const indexName = process.env.PINECONE_INDEX_NAME || "bandhan-kb";

  // Create index if it doesn't exist (serverless, dimension 384 for multilingual-e5-large)
  const existingIndexes = await pc.listIndexes();
  const exists = existingIndexes.indexes?.some((i) => i.name === indexName);
  if (!exists) {
    console.log(`Creating index ${indexName}...`);
    await pc.createIndex({
      name: indexName,
      dimension: 384,
      metric: "cosine",
      spec: { serverless: { cloud: "aws", region: "us-east-1" } },
    });
    // Wait for index to be ready
    await new Promise((r) => setTimeout(r, 10000));
  }

  const md = readFileSync(resolve(__dirname, "../knowledge-base/bandhan_kb.md"), "utf8");
  const chunks = chunkMarkdown(md);
  console.log(`Chunked into ${chunks.length} pieces`);

  const texts = chunks.map((c) => c.text);
  const embeddings = await pc.inference.embed("multilingual-e5-large", texts, {
    inputType: "passage",
    truncate: "END",
  });

  const vectors = chunks.map((chunk, i) => ({
    id: `chunk-${i}`,
    values: embeddings[i].values,
    metadata: { text: chunk.text, section: chunk.header },
  }));

  const index = pc.index(indexName);
  // Upsert in batches of 100
  for (let i = 0; i < vectors.length; i += 100) {
    await index.namespace("bandhan-kb").upsert(vectors.slice(i, i + 100));
    console.log(`Upserted ${Math.min(i + 100, vectors.length)}/${vectors.length}`);
  }
  console.log("Ingestion complete!");
}

main().catch(console.error);
