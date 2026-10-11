"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import { buildInvoicePdf } from "@/lib/pdf/build-invoice-pdf";
import { renderInvoiceEmail } from "@/lib/email-templates";
import { activeSupplements } from "@/lib/quote-supplements";

export type InvoiceItem = {
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
};

function generateReference() {
  const year = new Date().getFullYear();
  const n = Math.floor(1000 + Math.random() * 9000);
  return `F-${year}-${n}`;
}

export async function createInvoice(input: {
  client_id: string;
  tax_rate: number;
  due_date: string | null;
  items: InvoiceItem[];
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invoices")
    .insert({
      client_id: input.client_id,
      reference: generateReference(),
      tax_rate: input.tax_rate,
      due_date: input.due_date || null,
      items: input.items,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: "Impossible de créer la facture." };
  }

  revalidatePath("/admin/factures");
  revalidatePath(`/admin/clients/${input.client_id}`);
  redirect(`/admin/factures/${data.id}`);
}

export async function updateInvoice(
  id: string,
  input: { tax_rate: number; due_date: string | null; items: InvoiceItem[]; deduct_payments?: boolean },
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("invoices")
    .update({
      tax_rate: input.tax_rate,
      due_date: input.due_date || null,
      items: input.items,
      ...(input.deduct_payments !== undefined ? { deduct_payments: input.deduct_payments } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: "L'enregistrement a échoué. Réessaie." };

  revalidatePath(`/admin/factures/${id}`);
  revalidatePath("/admin/factures");
  return {};
}

export async function updateInvoiceStatus(id: string, status: string) {
  const supabase = await createClient();
  await supabase.from("invoices").update({ status }).eq("id", id);
  revalidatePath(`/admin/factures/${id}`);
  revalidatePath("/admin/factures");
}

export async function deleteInvoice(id: string, clientId: string | null) {
  const supabase = await createClient();
  await supabase.from("invoices").delete().eq("id", id);
  revalidatePath("/admin/factures");
  if (clientId) revalidatePath(`/admin/clients/${clientId}`);
  redirect(clientId ? `/admin/clients/${clientId}` : "/admin/factures");
}

// Facture classique pré-remplie depuis un devis (client, lignes, TVA) — rien à ressaisir.
export async function createInvoiceFromQuote(quoteId: string) {
  const supabase = await createClient();
  const { data: q } = await supabase
    .from("quotes")
    .select("id, client_id, reference, title, items, tax_rate, pricing_mode, package_total, supplements")
    .eq("id", quoteId)
    .single();
  if (!q) return { error: "Devis introuvable." };

  const quoteItems = (q.items as { title?: string; description: string; quantity: number; unit: string; unit_price: number }[] | null) ?? [];
  const items: InvoiceItem[] =
    q.pricing_mode === "forfait"
      ? [
          {
            description: [q.title || "Décoration événementielle", quoteItems.map((it) => it.title).filter(Boolean).join(", ")]
              .filter(Boolean)
              .join(" — ") + ` (devis ${q.reference})`,
            quantity: 1,
            unit: "forfait",
            unit_price: Number(q.package_total ?? 0),
          },
        ]
      : quoteItems.map((it) => ({
          description: it.title ? `${it.title} — ${it.description}` : it.description,
          quantity: it.quantity,
          unit: it.unit,
          unit_price: it.unit_price,
        }));

  // Ajouts après signature : une ligne chacun (montant final, TTC)
  for (const sup of activeSupplements(q.supplements)) {
    items.push({ description: `Ajout : ${sup.description}`, quantity: 1, unit: "forfait", unit_price: Number(sup.amount) });
  }

  const due = new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("invoices")
    .insert({
      client_id: q.client_id,
      quote_id: q.id,
      reference: generateReference(),
      // En forfait, le prix du forfait est déjà le total TTC
      tax_rate: q.pricing_mode === "forfait" ? 0 : q.tax_rate,
      due_date: due,
      items,
    })
    .select("id")
    .single();
  if (error || !data) return { error: "Impossible de créer la facture." };

  revalidatePath("/admin/factures");
  revalidatePath(`/admin/devis/${q.id}`);
  if (q.client_id) revalidatePath(`/admin/clients/${q.client_id}`);
  redirect(`/admin/factures/${data.id}`);
}

export async function sendInvoiceByEmail(invoiceId: string): Promise<{ ok?: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { error: "Envoi d'e-mail non configuré." };

  const supabase = await createClient();
  const { data: inv } = await supabase
    .from("invoices")
    .select("id, reference, due_date, public_token, items, tax_rate, quote_id, deduct_payments, clients(full_name, email)")
    .eq("id", invoiceId)
    .single();
  if (!inv) return { error: "Facture introuvable." };
  const client = inv.clients as unknown as { full_name: string; email: string | null } | null;
  if (!client?.email) return { error: "Ce client n'a pas d'adresse e-mail." };

  const items = (inv.items as InvoiceItem[]) ?? [];
  const total = items.reduce((s, it) => s + it.quantity * it.unit_price, 0) * (1 + Number(inv.tax_rate) / 100);
  let paid = 0;
  if (inv.quote_id && inv.deduct_payments) {
    const { data } = await supabase.from("quote_payments").select("amount").eq("quote_id", inv.quote_id).eq("status", "paye");
    paid = (data ?? []).reduce((s, p) => s + Number(p.amount), 0);
  }
  const due = Math.max(0, total - paid);
  const [intPart, decPart] = due.toFixed(2).split(".");
  const amountDue = `CHF ${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'")},${decPart}`;

  const pdf = await buildInvoicePdf(supabase, { id: inv.id });
  const link = `https://eventfiesta.ch/facture/${inv.public_token}/pdf`;
  const { error } = await new Resend(apiKey).emails.send({
    from: "Event Fiesta <notifications@eventfiesta.ch>",
    to: client.email,
    replyTo: "contact@eventfiesta.ch",
    subject: `Facture ${inv.reference} — Event Fiesta`,
    html: renderInvoiceEmail({
      firstName: client.full_name.trim().split(/\s+/)[0] ?? "",
      reference: inv.reference,
      amountDue,
      dueDate: inv.due_date ? new Date(inv.due_date).toLocaleDateString("fr-CH", { day: "numeric", month: "long", year: "numeric" }) : null,
      link,
    }),
    text: `Votre facture ${inv.reference} : ${amountDue} à régler.\n${link}`,
    attachments: pdf ? [{ filename: pdf.filename, content: pdf.buffer }] : undefined,
  });
  if (error) {
    console.error("sendInvoiceByEmail: erreur Resend", error);
    return { error: "L'e-mail n'a pas pu être envoyé. Réessaie." };
  }
  return { ok: true };
}
