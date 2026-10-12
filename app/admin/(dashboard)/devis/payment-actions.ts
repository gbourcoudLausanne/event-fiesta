"use server";

import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import { ensurePaymentSchedule, remainingAmount, PAYMENT_COLUMNS, type QuotePayment } from "@/lib/quote-payments";
import { PAY_I18N, paymentLabel, paymentDue, type PayLang } from "@/lib/payments-i18n";
import { renderPaymentReceivedEmail } from "@/lib/email-templates";
import { firstNameOf } from "@/lib/quote-share";

function chf(n: number) {
  const [intPart, decPart] = n.toFixed(2).split(".");
  return `CHF ${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'")},${decPart}`;
}

async function revalidateQuote(quoteId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("quotes").select("public_token").eq("id", quoteId).single();
  revalidatePath(`/admin/devis/${quoteId}`);
  revalidatePath("/admin");
  revalidatePath("/admin/paiements");
  if (data?.public_token) revalidatePath(`/devis/${data.public_token}`);
}

export async function createPaymentSchedule(quoteId: string) {
  const supabase = await createClient();
  await ensurePaymentSchedule(supabase, quoteId);
  await revalidateQuote(quoteId);
}

export async function addPayment(quoteId: string) {
  const supabase = await createClient();
  const { data: last } = await supabase
    .from("quote_payments")
    .select("position")
    .eq("quote_id", quoteId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  await supabase.from("quote_payments").insert({
    quote_id: quoteId,
    position: (last?.position ?? -1) + 1,
    kind: "autre",
    amount: 0,
  });
  await revalidateQuote(quoteId);
}

export async function updatePayment(
  paymentId: string,
  input: { label: string; amount: number; due_label: string },
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quote_payments")
    .update({
      label: input.label.trim() || null,
      amount: Math.max(0, Math.round(input.amount * 100) / 100),
      due_label: input.due_label.trim() || null,
    })
    .eq("id", paymentId)
    .select("quote_id")
    .single();
  if (error || !data) return { error: "L'enregistrement a échoué." };
  await revalidateQuote(data.quote_id);
  return {};
}

export async function deletePayment(paymentId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("quote_payments").delete().eq("id", paymentId).select("quote_id").single();
  if (data) await revalidateQuote(data.quote_id);
}

export async function markPaymentUnpaid(paymentId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("quote_payments")
    .update({ status: "a_payer", paid_at: null, method: null })
    .eq("id", paymentId)
    .select("quote_id")
    .single();
  if (data) await revalidateQuote(data.quote_id);
}

// Date choisie (AAAA-MM-JJ, heure suisse) → horodatage : maintenant si c'est aujourd'hui,
// sinon midi ce jour-là. Jamais dans le futur.
function paidAtFrom(day: string | null | undefined) {
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Zurich" });
  if (!day || !/^\d{4}-\d{2}-\d{2}$/.test(day) || day >= today) return new Date().toISOString();
  return new Date(`${day}T12:00:00+02:00`).toISOString();
}

export async function updatePaymentDate(paymentId: string, day: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quote_payments")
    .update({ paid_at: paidAtFrom(day) })
    .eq("id", paymentId)
    .eq("status", "paye")
    .select("quote_id")
    .single();
  if (error || !data) return { error: "La date n'a pas pu être enregistrée." };
  await revalidateQuote(data.quote_id);
  return {};
}

export async function markPaymentPaid(
  paymentId: string,
  method: "twint" | "virement" | "especes" | "carte",
  notifyClient: boolean,
  paidOn?: string,
): Promise<{ error?: string; emailed?: boolean }> {
  const supabase = await createClient();
  const { data: paid, error } = await supabase
    .from("quote_payments")
    .update({ status: "paye", paid_at: paidAtFrom(paidOn), method })
    .eq("id", paymentId)
    .select(PAYMENT_COLUMNS)
    .single();
  if (error || !paid) return { error: "Impossible d'enregistrer le paiement." };

  await revalidateQuote(paid.quote_id);
  if (!notifyClient) return {};

  // E-mail "paiement reçu" au client, dans sa langue, avec la prochaine étape.
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return {};
  try {
    const { data: q } = await supabase
      .from("quotes")
      .select("title, public_token, client_language, translated_content, balance_due_terms, clients(full_name, email)")
      .eq("id", paid.quote_id)
      .single();
    const client = q?.clients as unknown as { full_name: string; email: string | null } | null;
    if (!q || !client?.email) return {};

    const { data: all } = await supabase
      .from("quote_payments")
      .select(PAYMENT_COLUMNS)
      .eq("quote_id", paid.quote_id)
      .order("position");
    const payments = (all ?? []) as QuotePayment[];

    const lang = ((q.client_language as PayLang | null) ?? "fr") as PayLang;
    const t = PAY_I18N[lang];
    const tc = q.translated_content as { title?: string | null; balance_due_terms?: string | null } | null;
    const title = (lang !== "fr" && tc?.title) || q.title || "Event Fiesta";
    const balanceTerms = (lang !== "fr" && tc?.balance_due_terms) || q.balance_due_terms;
    const next = payments.find((p) => p.status !== "paye");
    const remaining = remainingAmount(payments);
    const label = paymentLabel(paid as QuotePayment, t);

    const { error: mailError } = await new Resend(apiKey).emails.send({
      from: "Event Fiesta <notifications@eventfiesta.ch>",
      to: client.email,
      replyTo: "contact@eventfiesta.ch",
      subject: t.receivedSubject(label),
      html: renderPaymentReceivedEmail({
        lang,
        firstName: firstNameOf(client.full_name),
        title,
        receivedLine: t.receivedBody(label, chf(Number(paid.amount))),
        nextLine: next ? t.nextStep(paymentLabel(next, t), chf(Number(next.amount)), paymentDue(next, t, balanceTerms)) : null,
        allPaidLine: remaining <= 0 ? t.allPaidMail : null,
        buttonLabel: t.viewTracking,
        link: `https://eventfiesta.ch/devis/${q.public_token}`,
      }),
      text: [t.receivedBody(label, chf(Number(paid.amount))), next ? t.nextStep(paymentLabel(next, t), chf(Number(next.amount)), paymentDue(next, t, balanceTerms)) : t.allPaidMail, `https://eventfiesta.ch/devis/${q.public_token}`].join("\n\n"),
    });
    if (mailError) {
      console.error("markPaymentPaid: erreur Resend", mailError);
      return { error: "Paiement enregistré, mais l'e-mail au client n'a pas pu partir." };
    }
    return { emailed: true };
  } catch (err) {
    console.error("markPaymentPaid: e-mail échoué", err);
    return { error: "Paiement enregistré, mais l'e-mail au client n'a pas pu partir." };
  }
}
