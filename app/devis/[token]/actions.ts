"use server";

import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { renderQuoteSignedEmail } from "@/lib/email-templates";

const NOTIFY_TO = "contact@eventfiesta.ch";
const NOTIFY_FROM = "Event Fiesta <notifications@eventfiesta.ch>";

function chf(n: number) {
  const [intPart, decPart] = n.toFixed(2).split(".");
  return `CHF ${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'")},${decPart}`;
}

// Prévient Event Fiesta par e-mail. Non bloquant : la signature du client
// est déjà enregistrée, un souci d'envoi ne doit pas lui afficher d'erreur.
async function notifySigned(quoteId: string, signerName: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("signQuote: RESEND_API_KEY manquante, pas de notification");
    return;
  }
  try {
    const supabase = createAdminClient();
    const { data: q } = await supabase
      .from("quotes")
      .select("id, reference, title, event_date, tax_rate, items, pricing_mode, package_total, clients(full_name)")
      .eq("id", quoteId)
      .single();
    if (!q) return;

    const items = (q.items as { quantity: number; unit_price: number }[]) ?? [];
    const subtotal = items.reduce((s, it) => s + it.quantity * it.unit_price, 0);
    const total = q.pricing_mode === "forfait" ? q.package_total ?? 0 : subtotal * (1 + q.tax_rate / 100);
    const clientName = (q.clients as unknown as { full_name: string } | null)?.full_name ?? signerName;
    const eventDate = q.event_date
      ? new Date(q.event_date).toLocaleDateString("fr-CH", { day: "numeric", month: "long", year: "numeric" })
      : null;

    const { error } = await new Resend(apiKey).emails.send({
      from: NOTIFY_FROM,
      to: NOTIFY_TO,
      subject: `✓ Devis signé — ${clientName} (${q.reference})`,
      html: renderQuoteSignedEmail({
        reference: q.reference,
        title: q.title || "Devis",
        clientName,
        signerName,
        eventDate,
        total: chf(total),
        adminUrl: `https://eventfiesta.ch/admin/devis/${q.id}`,
      }),
      text: `${clientName} a signé le devis ${q.reference} (${chf(total)}).\nhttps://eventfiesta.ch/admin/devis/${q.id}`,
    });
    if (error) console.error("signQuote: erreur Resend", error);
  } catch (err) {
    console.error("signQuote: notification échouée", err);
  }
}

export async function signQuote(
  token: string,
  input: { signerName: string; signatureDataUrl: string },
) {
  if (!input.signerName.trim() || !input.signatureDataUrl) {
    return { error: "Nom et signature requis." };
  }

  const supabase = createAdminClient();

  const { data: quote } = await supabase
    .from("quotes")
    .select("id, status, signed_at")
    .eq("public_token", token)
    .single();

  if (!quote) {
    return { error: "Devis introuvable." };
  }

  const { error } = await supabase
    .from("quotes")
    .update({
      status: "accepte",
      signature_data: input.signatureDataUrl,
      signed_by: input.signerName.trim(),
      signed_at: new Date().toISOString(),
    })
    .eq("id", quote.id);

  if (error) {
    return { error: "Impossible d'enregistrer la signature." };
  }

  // Une seule notification par devis, même si la page est re-signée
  if (!quote.signed_at) await notifySigned(quote.id, input.signerName.trim());

  revalidatePath(`/devis/${token}`);
  return { ok: true };
}
