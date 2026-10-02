"use server";

import Anthropic from "@anthropic-ai/sdk";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const LANG_NAMES: Record<string, string> = { fr: "français", es: "español", en: "English" };

export async function translateQuote(quoteId: string, targetLang: "fr" | "es" | "en") {
  const supabase = await createClient();
  const { data: quote } = await supabase
    .from("quotes")
    .select("title, event_type, venue, balance_due_terms, items")
    .eq("id", quoteId)
    .single();

  if (!quote) return { error: "Devis introuvable." };

  const source = {
    title: quote.title,
    event_type: quote.event_type,
    venue: quote.venue,
    balance_due_terms: quote.balance_due_terms,
    items: (
      (quote.items as { title?: string; description: string; unit: string }[] | null) ?? []
    ).map((it) => ({
      title: it.title ?? null,
      description: it.description,
      unit: it.unit,
    })),
  };

  if (!process.env.ANTHROPIC_API_KEY) {
    return { error: "Clé API de traduction non configurée." };
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  let message;
  try {
    message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      system:
        `Tu traduis le contenu d'un devis de décoration d'événements vers le ${LANG_NAMES[targetLang]}. ` +
        "Réponds UNIQUEMENT avec un objet JSON valide ayant exactement la même structure que l'entrée " +
        "(mêmes clés, même imbrication), en traduisant uniquement les valeurs textuelles. " +
        "Ne traduis jamais une valeur null — laisse-la à null. N'ajoute aucun texte avant ou après le JSON.",
      messages: [{ role: "user", content: JSON.stringify(source) }],
    });
  } catch {
    return { error: "Échec de l'appel au service de traduction." };
  }

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    return { error: "Réponse de traduction invalide." };
  }

  let translated: typeof source;
  try {
    const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
    translated = JSON.parse(jsonMatch ? jsonMatch[0] : textBlock.text);
  } catch {
    return { error: "Impossible d'analyser la traduction." };
  }

  await supabase
    .from("quotes")
    .update({ client_language: targetLang, translated_content: translated })
    .eq("id", quoteId);

  revalidatePath(`/admin/devis/${quoteId}`);
  return { ok: true };
}

export async function resetQuoteTranslation(quoteId: string) {
  const supabase = await createClient();
  await supabase.from("quotes").update({ client_language: null, translated_content: null }).eq("id", quoteId);
  revalidatePath(`/admin/devis/${quoteId}`);
}
