// Debug endpoint — lists Google Cloud TTS voices available to the configured key.
// Optional ?lang=hi-IN (or bn-IN, mr-IN, en-IN) filters by language code.
export default async function handler(req, res) {
  const apiKey = process.env.GOOGLE_TTS_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "TTS not configured" });

  const lang = req.query?.lang;
  const url =
    `https://texttospeech.googleapis.com/v1/voices?key=${apiKey}` +
    (lang ? `&languageCode=${encodeURIComponent(lang)}` : "");

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: err?.error?.message || "voices error" });
    }

    const { voices = [] } = await response.json();
    const simplified = voices
      .map((v) => ({
        name: v.name,
        languageCodes: v.languageCodes,
        gender: v.ssmlGender,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    res.status(200).json({ count: simplified.length, voices: simplified });
  } catch (e) {
    res.status(500).json({ error: e.message || "voices request failed" });
  }
}
