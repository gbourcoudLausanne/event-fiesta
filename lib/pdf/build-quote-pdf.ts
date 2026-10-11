import { renderToBuffer } from "@react-pdf/renderer";
import type { SupabaseClient } from "@supabase/supabase-js";
import { DevisPdfDocument, type DevisPdfItem } from "@/lib/pdf/devis-pdf";

// Génère le PDF d'un devis (par id côté admin, par jeton public côté client / e-mails).
// Utilisé par la route admin, la route publique de téléchargement et les e-mails.
export async function buildQuotePdf(
  supabase: SupabaseClient,
  filter: { id: string } | { token: string },
): Promise<{ buffer: Buffer; reference: string; filename: string } | null> {
  const query = supabase
    .from("quotes")
    .select(
      "reference, title, event_type, event_date, venue, tax_rate, items, created_at, deposit_percent, deposit_amount, balance_due_terms, payment_methods, pricing_mode, package_total, client_language, translated_content, show_notes, notes_text, signed_by, signed_at, signature_data, clients(full_name, email, phone, address)",
    );
  const [{ data: quote }, { data: settings }] = await Promise.all([
    "id" in filter ? query.eq("id", filter.id).single() : query.eq("public_token", filter.token).single(),
    supabase.from("settings").select("creditor_name, iban, twint_phone").eq("id", true).single(),
  ]);
  if (!quote) return null;

  const client = quote.clients as unknown as {
    full_name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
  } | null;

  const buffer = await renderToBuffer(
    DevisPdfDocument({
      reference: quote.reference,
      title: quote.title,
      createdAt: quote.created_at,
      eventType: quote.event_type,
      eventDate: quote.event_date,
      venue: quote.venue,
      client: client ?? { full_name: "—", email: null, phone: null, address: null },
      items: (quote.items as DevisPdfItem[]) ?? [],
      taxRate: quote.tax_rate,
      depositPercent: quote.deposit_percent,
      depositAmountFixed: quote.deposit_amount,
      balanceDueTerms: quote.balance_due_terms,
      paymentMethods: quote.payment_methods ?? [],
      pricingMode: (quote.pricing_mode as "detaille" | "forfait") ?? "detaille",
      packageTotal: quote.package_total,
      lang: (quote.client_language as "fr" | "es" | "en") ?? "fr",
      translatedContent: quote.translated_content,
      showNotes: quote.show_notes,
      notesText: quote.notes_text,
      signedBy: quote.signed_by,
      signedAt: quote.signed_at,
      signatureData: quote.signature_data,
      settings,
    }),
  );

  const suffix = quote.signed_at ? "-signe" : "";
  return { buffer, reference: quote.reference, filename: `devis-${quote.reference}${suffix}.pdf` };
}
