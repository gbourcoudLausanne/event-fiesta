"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

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
    .select("id, status")
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

  revalidatePath(`/devis/${token}`);
  return { ok: true };
}
