import Anthropic from "@anthropic-ai/sdk";

const LANG_NAMES: Record<string, string> = { fr: "français", es: "español", en: "English" };

// Traduit de courts textes (ex : ajouts après signature) vers la langue du client.
// Renvoie null si la traduction échoue (on garde alors le texte original).
export async function translateTexts(texts: string[], targetLang: "fr" | "es" | "en"): Promise<string[] | null> {
  if (texts.length === 0) return [];
  if (!process.env.ANTHROPIC_API_KEY) return null;
  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1000,
      system:
        `Tu traduis de courts éléments d'un devis de décoration d'événements vers le ${LANG_NAMES[targetLang]}. ` +
        "Réponds UNIQUEMENT avec un tableau JSON de chaînes, dans le même ordre et de même longueur que l'entrée.",
      messages: [{ role: "user", content: JSON.stringify(texts) }],
    });
    const block = message.content.find((b) => b.type === "text");
    if (!block || block.type !== "text") return null;
    const match = block.text.match(/\[[\s\S]*\]/);
    const out = JSON.parse(match ? match[0] : block.text);
    return Array.isArray(out) && out.length === texts.length && out.every((x) => typeof x === "string") ? out : null;
  } catch (err) {
    console.error("translateTexts: échec", err);
    return null;
  }
}
