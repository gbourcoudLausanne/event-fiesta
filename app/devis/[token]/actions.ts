"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { renderQuoteSignedEmail, renderQuoteConfirmedClientEmail } from "@/lib/email-templates";
import { buildQuotePdf } from "@/lib/pdf/build-quote-pdf";
import { shareCopy, firstNameOf, type ShareLang } from "@/lib/quote-share";
import { DEVIS_I18N, formatSignedAt } from "@/lib/devis-i18n";
import { ensurePaymentSchedule, PAYMENT_COLUMNS, type QuotePayment } from "@/lib/quote-payments";
import { allSupplements } from "@/lib/quote-supplements";
import { PAY_I18N, paymentLabel, twintReference } from "@/lib/payments-i18n";

const NOTIFY_TO = "contact@eventfiesta.ch";
const NOTIFY_FROM = "Event Fiesta <notifications@eventfiesta.ch>";

function chf(n: number) {
  const [intPart, decPart] = n.toFixed(2).split(".");
  return `CHF ${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'")},${decPart}`;
}

// Après signature : e-mail de confirmation au client (PDF signé + lien en ligne)
// et notification à Event Fiesta (même PDF). Non bloquant : la signature est
// déjà enregistrée, un souci d'envoi ne doit pas afficher d'erreur au client.
async function sendSignedEmails(quoteId: string, signerName: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("signQuote: RESEND_API_KEY manquante, pas d'e-mails");
    return;
  }
  try {
    const supabase = createAdminClient();
    const { data: q } = await supabase
      .from("quotes")
      .select(
        "id, reference, title, event_date, tax_rate, items, pricing_mode, package_total, public_token, signed_at, client_language, translated_content, clients(full_name, email)",
      )
      .eq("id", quoteId)
      .single();
    if (!q) return;

    const items = (q.items as { quantity: number; unit_price: number }[]) ?? [];
    const subtotal = items.reduce((s, it) => s + it.quantity * it.unit_price, 0);
    const total = q.pricing_mode === "forfait" ? q.package_total ?? 0 : subtotal * (1 + q.tax_rate / 100);
    const client = q.clients as unknown as { full_name: string; email: string | null } | null;
    const clientName = client?.full_name ?? signerName;
    const eventDate = q.event_date
      ? new Date(q.event_date).toLocaleDateString("fr-CH", { day: "numeric", month: "long", year: "numeric" })
      : null;
    const link = `https://eventfiesta.ch/devis/${q.public_token}`;

    const pdf = await buildQuotePdf(supabase, { id: q.id }).catch((err) => {
      console.error("signQuote: PDF signé non généré", err);
      return null;
    });
    const attachments = pdf ? [{ filename: pdf.filename, content: pdf.buffer }] : undefined;
    const resend = new Resend(apiKey);

    // 1) Client
    if (client?.email) {
      const lang = ((q.client_language as ShareLang | null) ?? "fr") as ShareLang;
      const c = shareCopy(lang);
      const translatedTitle = (q.translated_content as { title?: string | null } | null)?.title;
      const title = (lang !== "fr" && translatedTitle) || q.title || "Event Fiesta";
      const { date, time } = formatSignedAt(q.signed_at ?? new Date().toISOString(), DEVIS_I18N[lang].locale);
      const [{ data: firstDue }, { data: settings }] = await Promise.all([
        supabase.from("quote_payments").select(PAYMENT_COLUMNS).eq("quote_id", q.id).eq("status", "a_payer").order("position").limit(1).maybeSingle(),
        supabase.from("settings").select("twint_phone").eq("id", true).single(),
      ]);
      const due = firstDue as QuotePayment | null;
      const pt = PAY_I18N[lang];
      const depositNote =
        due && due.kind === "acompte" && settings?.twint_phone
          ? { title: pt.depositMailTitle, body: pt.depositMailBody(chf(Number(due.amount)), settings.twint_phone, twintReference(q.reference, paymentLabel(due, pt))) }
          : null;
      const { error } = await resend.emails.send({
        from: NOTIFY_FROM,
        to: client.email,
        replyTo: NOTIFY_TO,
        subject: c.confirmSubject(title),
        html: renderQuoteConfirmedClientEmail({ lang, firstName: firstNameOf(clientName), title, date, time, link, depositNote }),
        text: `${c.greeting(firstNameOf(clientName))}\n\n${c.confirmIntro(date, time)}\n\n${depositNote ? `${depositNote.title}\n${depositNote.body}\n\n` : ""}${c.confirmBody}\n${link}\n\n${c.closing}`,
        attachments,
      });
      if (error) console.error("signQuote: erreur Resend (client)", error);
    }

    // 2) Event Fiesta
    const { error } = await resend.emails.send({
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
      attachments,
    });
    if (error) console.error("signQuote: erreur Resend (notification)", error);
  } catch (err) {
    console.error("signQuote: envoi des e-mails échoué", err);
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

  // Étapes de paiement (acompte / solde) visibles tout de suite sur la page client
  await ensurePaymentSchedule(supabase, quote.id);

  // E-mails envoyés une seule fois par devis, même si la page est re-signée
  // Envoyés après la réponse : la signature s'affiche tout de suite côté client.
  if (!quote.signed_at) {
    const signerName = input.signerName.trim();
    after(() => sendSignedEmails(quote.id, signerName));
  }

  revalidatePath(`/devis/${token}`);
  return { ok: true };
}

// Le client confirme les ajouts après signature (un clic, sans nouvelle signature).
export async function acceptSupplements(token: string): Promise<{ ok?: boolean; error?: string }> {
  const supabase = createAdminClient();
  const { data: q } = await supabase
    .from("quotes")
    .select("id, reference, supplements, clients(full_name)")
    .eq("public_token", token)
    .single();
  if (!q) return { error: "Devis introuvable." };

  const now = new Date().toISOString();
  const list = allSupplements(q.supplements);
  const pending = list.filter((s) => !s.removed_at && !s.accepted_at);
  if (pending.length === 0) return { ok: true };

  const { error } = await supabase
    .from("quotes")
    .update({ supplements: list.map((s) => (!s.removed_at && !s.accepted_at ? { ...s, accepted_at: now } : s)) })
    .eq("id", q.id);
  if (error) return { error: "La confirmation n'a pas pu être enregistrée." };

  revalidatePath(`/devis/${token}`);
  revalidatePath(`/admin/devis/${q.id}`);

  // Prévenir Event Fiesta (non bloquant)
  const clientName = (q.clients as unknown as { full_name: string } | null)?.full_name ?? "Le client";
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    after(async () => {
      const { error: mailError } = await new Resend(apiKey).emails.send({
        from: NOTIFY_FROM,
        to: NOTIFY_TO,
        subject: `✓ Ajouts confirmés — ${clientName} (${q.reference})`,
        text: `${clientName} a confirmé les ajouts sur le devis ${q.reference} :\n${pending.map((s) => `- ${s.description} : CHF ${Number(s.amount).toFixed(2)}`).join("\n")}\n\nhttps://eventfiesta.ch/admin/devis/${q.id}`,
      });
      if (mailError) console.error("acceptSupplements: erreur Resend", mailError);
    });
  }
  return { ok: true };
}
