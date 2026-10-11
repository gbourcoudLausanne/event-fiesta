import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildInvoicePdf } from "@/lib/pdf/build-invoice-pdf";

export const runtime = "nodejs";

// Lien public de la facture (envoyé au client) : le jeton suffit, comme pour les devis.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const pdf = await buildInvoicePdf(createAdminClient(), { token });
  if (!pdf) return NextResponse.json({ error: "Facture introuvable." }, { status: 404 });

  return new NextResponse(new Uint8Array(pdf.buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${pdf.filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
