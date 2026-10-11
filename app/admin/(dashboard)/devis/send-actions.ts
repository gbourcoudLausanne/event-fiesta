"use server";

import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import { renderQuoteToClientEmail } from "@/lib/email-templates";
import { shareCopy, firstNameOf, type ShareLang } from "@/lib/quote-share";
import { buildQuotePdf } from "@/lib/pdf/build-quote-pdf";

const FROM = "Event Fiesta <notifications@eventfiesta.ch>";
const REPLY_TO = "contact@eventfiesta.ch";

// Un devis encore en brouillon passe à "Envoyé" dès qu'on l'envoie au client.
export async function markQuoteSent(quoteId: string) {
  const supabase = await createClient();
  await supabase.from("quotes").update({ status: "envoye" }).eq("id", quoteId).eq("status", "brouillon");
  revalidatePath(`/admin/devis/${quoteId}`);
  revalidatePath("/admin/devis");
}

export async function sendQuoteByEmail(quoteId: string): Promise<{ ok?: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { error: "Envoi d'e-mail non configuré." };

  const supabase = await createClient();
  const { data: q } = await supabase
    .from("quotes")
    .select("id, title, public_token, client_language, translated_content, clients(full_name, email)")
    .eq("id", quoteId)
    .single();
  if (!q) return { error: "Devis introuvable." };

  const client = q.clients as unknown as { full_name: string; email: string | null } | null;
  if (!client?.email) return { error: "Ce client n'a pas d'adresse e-mail." };

  const lang = ((q.client_language as ShareLang | null) ?? "fr") as ShareLang;
  const translatedTitle = (q.translated_content as { title?: string | null } | null)?.title;
  const title = (lang !== "fr" && translatedTitle) || q.title || "Event Fiesta";
  const link = `https://eventfiesta.ch/devis/${q.public_token}`;
  const c = shareCopy(lang);
  const pdf = await buildQuotePdf(supabase, { id: quoteId }).catch((err) => {
    console.error("sendQuoteByEmail: PDF non généré, envoi sans pièce jointe", err);
    return null;
  });

  const { error } = await new Resend(apiKey).emails.send({
    from: FROM,
    to: client.email,
    replyTo: REPLY_TO,
    subject: c.subject(title),
    html: renderQuoteToClientEmail({ lang, firstName: firstNameOf(client.full_name), title, link }),
    text: `${c.greeting(firstNameOf(client.full_name))}\n\n${c.body(title)}\n${link}\n\n${c.cta}\n\n${c.closing}`,
    attachments: pdf ? [{ filename: pdf.filename, content: pdf.buffer }] : undefined,
  });
  if (error) {
    console.error("sendQuoteByEmail: erreur Resend", error);
    return { error: "L'e-mail n'a pas pu être envoyé. Réessaie." };
  }

  await markQuoteSent(quoteId);
  return { ok: true };
}
