// Google Cloud Text-to-Speech proxy — keeps API key server-side
const VOICE_MAP = {
  "hi-IN": { languageCode: "hi-IN", name: "hi-IN-Neural2-B" },
  "bn-IN": { languageCode: "bn-IN", name: "bn-IN-Neural2-B" },
  "mr-IN": { languageCode: "mr-IN", name: "mr-IN-Wavenet-B" },
  "en-IN": { languageCode: "en-IN", name: "en-IN-Neural2-B" },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { text, langCode } = req.body || {};
  if (!text) return res.status(400).json({ error: "text is required" });

  const apiKey = process.env.GOOGLE_TTS_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "TTS not configured" });

  const voice = VOICE_MAP[langCode] || VOICE_MAP["en-IN"];

  try {
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: { text },
          voice,
          audioConfig: { audioEncoding: "MP3", speakingRate: 0.95 },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: err?.error?.message || "TTS error" });
    }

    const { audioContent } = await response.json();
    res.status(200).json({ audioContent });
  } catch (e) {
    res.status(500).json({ error: e.message || "TTS request failed" });
  }
}
