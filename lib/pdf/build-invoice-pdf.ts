import { renderToBuffer } from "@react-pdf/renderer";
import type { SupabaseClient } from "@supabase/supabase-js";
import { InvoicePdfDocument } from "@/lib/pdf/invoice-pdf";

// PDF d'une facture (par id côté admin, par jeton public côté client / e-mails).
// Si la facture vient d'un devis et que l'option est active, les paiements déjà
// reçus sur ce devis (acompte…) sont déduits du reste à payer.
export async function buildInvoicePdf(
  supabase: SupabaseClient,
  filter: { id: string } | { token: string },
): Promise<{ buffer: Buffer; reference: string; filename: string } | null> {
  const query = supabase
    .from("invoices")
    .select("reference, created_at, due_date, items, tax_rate, status, quote_id, deduct_payments, clients(full_name, email, phone, address), quotes(reference)");
  const [{ data: inv }, { data: settings }] = await Promise.all([
    "id" in filter ? query.eq("id", filter.id).single() : query.eq("public_token", filter.token).single(),
    supabase.from("settings").select("creditor_name, creditor_address, creditor_zip, creditor_city, iban, twint_phone").eq("id", true).single(),
  ]);
  if (!inv) return null;

  let alreadyPaid = 0;
  if (inv.quote_id && inv.deduct_payments) {
    const { data: paid } = await supabase.from("quote_payments").select("amount").eq("quote_id", inv.quote_id).eq("status", "paye");
    alreadyPaid = (paid ?? []).reduce((sum, p) => sum + Number(p.amount), 0);
  }

  const client = inv.clients as unknown as { full_name: string; email: string | null; phone: string | null; address: string | null } | null;
  const buffer = await renderToBuffer(
    InvoicePdfDocument({
      reference: inv.reference,
      createdAt: inv.created_at,
      dueDate: inv.due_date,
      client: client ?? { full_name: "—", email: null, phone: null, address: null },
      quoteReference: (inv.quotes as unknown as { reference: string } | null)?.reference ?? null,
      items: (inv.items as { description: string; quantity: number; unit: string; unit_price: number }[]) ?? [],
      taxRate: Number(inv.tax_rate),
      alreadyPaid,
      status: inv.status,
      settings,
    }),
  );
  return { buffer, reference: inv.reference, filename: `facture-${inv.reference}.pdf` };
}
