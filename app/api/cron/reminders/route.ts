import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { renderReminderEmail, renderRemindersDigestEmail } from "@/lib/email-templates";
import { REMINDER_I18N, PAY_I18N, paymentLabel, twintReference, type PayLang } from "@/lib/payments-i18n";
import { firstNameOf } from "@/lib/quote-share";
import { notifyAdmin } from "@/lib/push";

export const runtime = "nodejs";
export const maxDuration = 60;

// Tâche quotidienne (Vercel Cron, voir vercel.json). Chaque relance part une seule fois :
//  1. devis envoyé sans réponse depuis 7 jours
//  2. acompte pas payé 48 h après la signature
//  3. solde pas payé la veille de l'événement
// Puis un récapitulatif à contact@eventfiesta.ch s'il y a eu des envois.

const FROM = "Event Fiesta <notifications@eventfiesta.ch>";
const ADMIN = "contact@eventfiesta.ch";

function chf(n: number) {
  const [intPart, decPart] = n.toFixed(2).split(".");
  return `CHF ${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'")},${decPart}`;
}

type QuoteRow = {
  id: string;
  reference: string;
  title: string | null;
  public_token: string;
  event_date: string | null;
  signed_at: string | null;
  client_language: string | null;
  translated_content: { title?: string | null } | null;
  clients: { full_name: string; email: string | null } | null;
};

const QUOTE_COLS =
  "id, reference, title, public_token, event_date, signed_at, client_language, translated_content, clients(full_name, email)";

function langOf(q: QuoteRow): PayLang {
  return ((q.client_language as PayLang | null) ?? "fr") as PayLang;
}
function titleOf(q: QuoteRow, lang: PayLang) {
  return (lang !== "fr" && q.translated_content?.title) || q.title || "Event Fiesta";
}
function linkOf(q: QuoteRow) {
  return `https://eventfiesta.ch/devis/${q.public_token}`;
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "RESEND_API_KEY manquante" }, { status: 500 });

  const supabase = createAdminClient();

  // Récap du matin sur le téléphone de l'admin (indépendant des relances clients)
  await morningRecap(supabase);

  const { data: settings } = await supabase.from("settings").select("auto_reminders, twint_phone").eq("id", true).single();
  if (settings && settings.auto_reminders === false) return NextResponse.json({ skipped: "désactivé dans Réglages" });

  const resend = new Resend(apiKey);
  const now = Date.now();
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Zurich" });
  const tomorrow = new Date(Date.parse(`${today}T12:00:00Z`) + 86400000).toISOString().slice(0, 10);
  const digest: { label: string; value: string; url: string }[] = [];
  const twint = settings?.twint_phone ?? null;

  async function send(q: QuoteRow, subject: string, heading: string, body: string, button: string, footnote: string | null) {
    const lang = langOf(q);
    const { error } = await resend.emails.send({
      from: FROM,
      to: q.clients!.email!,
      replyTo: ADMIN,
      subject,
      html: renderReminderEmail({
        lang,
        firstName: firstNameOf(q.clients!.full_name),
        title: titleOf(q, lang),
        heading,
        body,
        footnote,
        buttonLabel: button,
        link: linkOf(q),
      }),
      text: `${body}\n\n${linkOf(q)}`,
    });
    if (error) console.error("cron reminders: erreur Resend", q.reference, error);
    return !error;
  }

  // 1. Devis envoyé sans réponse depuis 7 jours
  const { data: pending } = await supabase
    .from("quotes")
    .select(QUOTE_COLS)
    .eq("status", "envoye")
    .is("signed_at", null)
    .is("reminder_sent_at", null)
    .lte("sent_at", new Date(now - 7 * 86400000).toISOString());
  for (const q of (pending ?? []) as unknown as QuoteRow[]) {
    if (!q.clients?.email) continue;
    if (q.event_date && q.event_date < today) continue;
    const r = REMINDER_I18N[langOf(q)];
    const title = titleOf(q, langOf(q));
    if (await send(q, r.quoteSubject(title), r.quoteTitle, r.quoteBody(title), r.quoteButton, null)) {
      await supabase.from("quotes").update({ reminder_sent_at: new Date().toISOString() }).eq("id", q.id);
      digest.push({ label: `${q.clients.full_name} — ${q.reference}`, value: "Devis sans réponse depuis 7 jours", url: `https://eventfiesta.ch/admin/devis/${q.id}` });
    }
  }

  // 2 & 3. Paiements en attente (acompte 48 h après signature, solde la veille de l'événement)
  if (twint) {
    const { data: due } = await supabase
      .from("quote_payments")
      .select(`id, kind, label, amount, quotes(${QUOTE_COLS})`)
      .eq("status", "a_payer")
      .is("reminded_at", null)
      .gt("amount", 0)
      .in("kind", ["acompte", "solde"]);

    for (const p of (due ?? []) as unknown as { id: string; kind: string; label: string | null; amount: number; quotes: QuoteRow | null }[]) {
      const q = p.quotes;
      if (!q?.clients?.email || !q.signed_at) continue;
      const lang = langOf(q);
      const r = REMINDER_I18N[lang];
      const label = paymentLabel(p, PAY_I18N[lang]);
      const ref = twintReference(q.reference, label);

      const depositDue =
        p.kind === "acompte" && Date.parse(q.signed_at) <= now - 48 * 3600000 && (!q.event_date || q.event_date >= today);
      const balanceDue = p.kind === "solde" && q.event_date === tomorrow;
      if (!depositDue && !balanceDue) continue;

      const ok = depositDue
        ? await send(q, r.depositSubject, r.depositTitle, r.depositBody(chf(Number(p.amount)), twint, ref), r.trackButton, r.ignoreIfPaid)
        : await send(q, r.balanceSubject, r.balanceTitle, r.balanceBody(chf(Number(p.amount)), twint, ref), r.trackButton, r.ignoreIfPaid);
      if (ok) {
        await supabase.from("quote_payments").update({ reminded_at: new Date().toISOString() }).eq("id", p.id);
        digest.push({
          label: `${q.clients.full_name} — ${q.reference}`,
          value: depositDue ? `Rappel d'acompte (${chf(Number(p.amount))})` : `Rappel de solde, événement demain (${chf(Number(p.amount))})`,
          url: `https://eventfiesta.ch/admin/devis/${q.id}`,
        });
      }
    }
  }

  if (digest.length > 0) {
    const { error } = await resend.emails.send({
      from: FROM,
      to: ADMIN,
      subject: `Relances envoyées aujourd'hui (${digest.length})`,
      html: renderRemindersDigestEmail(digest),
      text: digest.map((d) => `${d.label} : ${d.value}`).join("\n"),
    });
    if (error) console.error("cron reminders: récap non envoyé", error);
  }

  return NextResponse.json({ sent: digest.length });
}

// Ce qui attend l'admin aujourd'hui, résumé en une notification (rien si tout est à jour).
async function morningRecap(supabase: ReturnType<typeof createAdminClient>) {
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Zurich" });
  const in7 = new Date(Date.parse(`${today}T12:00:00Z`) + 7 * 86400000).toISOString().slice(0, 10);
  const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString();
  const fiveDaysAgo = new Date(Date.now() - 5 * 86400000).toISOString();

  const [{ data: payments }, { data: noReply }, { data: webClients }, { data: quoted }] = await Promise.all([
    supabase.from("quote_payments").select("kind, amount, quotes(signed_at, event_date)").eq("status", "a_payer").gt("amount", 0),
    supabase.from("quotes").select("id").eq("status", "envoye").is("signed_at", null).lte("sent_at", fiveDaysAgo),
    supabase.from("clients").select("id").eq("source", "site_web"),
    supabase.from("quotes").select("client_id"),
  ]);

  const rows = (payments ?? []) as unknown as { kind: string; amount: number; quotes: { signed_at: string | null; event_date: string | null } | null }[];
  const deposits = rows.filter((p) => p.kind === "acompte" && p.quotes?.signed_at && p.quotes.signed_at <= twoDaysAgo && (!p.quotes.event_date || p.quotes.event_date >= today));
  const balances = rows.filter((p) => p.kind !== "acompte" && p.quotes?.event_date && p.quotes.event_date >= today && p.quotes.event_date <= in7);
  const quotedIds = new Set((quoted ?? []).map((q) => q.client_id));
  const newLeads = (webClients ?? []).filter((c) => !quotedIds.has(c.id));

  const lines = [
    newLeads.length && `${newLeads.length} nouvelle${newLeads.length > 1 ? "s" : ""} demande${newLeads.length > 1 ? "s" : ""}`,
    deposits.length && `${deposits.length} acompte${deposits.length > 1 ? "s" : ""} en attente`,
    balances.length && `${balances.length} solde${balances.length > 1 ? "s" : ""} avant un événement cette semaine`,
    (noReply ?? []).length && `${(noReply ?? []).length} devis sans réponse`,
  ].filter(Boolean) as string[];
  const total = newLeads.length + deposits.length + balances.length + (noReply ?? []).length;
  if (total === 0) return;

  await notifyAdmin({
    title: `${total} chose${total > 1 ? "s" : ""} à regarder aujourd'hui`,
    body: lines.join(" · "),
    url: "/admin",
    tag: `recap-${today}`,
  });
}
