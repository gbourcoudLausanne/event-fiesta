import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { DevisPdfDocument, type DevisPdfItem } from "@/lib/pdf/devis-pdf";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await params;
  const [{ data: quote }, { data: settings }] = await Promise.all([
    supabase
      .from("quotes")
      .select(
        "reference, title, event_type, event_date, venue, tax_rate, items, created_at, deposit_percent, deposit_amount, balance_due_terms, payment_methods, pricing_mode, package_total, client_language, translated_content, clients(full_name, email, phone, address)",
      )
      .eq("id", id)
      .single(),
    supabase.from("settings").select("creditor_name, iban, twint_phone").eq("id", true).single(),
  ]);

  if (!quote) {
    return NextResponse.json({ error: "Devis introuvable." }, { status: 404 });
  }

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
      settings,
    }),
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="devis-${quote.reference}.pdf"`,
    },
  });
}
