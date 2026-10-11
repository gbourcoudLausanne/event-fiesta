import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildQuotePdf } from "@/lib/pdf/build-quote-pdf";

export const runtime = "nodejs";

// Téléchargement public du PDF : le jeton du lien client suffit (comme pour la page du devis).
export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const pdf = await buildQuotePdf(createAdminClient(), { token });
  if (!pdf) {
    return NextResponse.json({ error: "Devis introuvable." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(pdf.buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${pdf.filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
