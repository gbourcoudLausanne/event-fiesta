"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateSettings(
  _prev: { ok?: boolean; error?: string } | undefined,
  formData: FormData,
): Promise<{ ok?: boolean; error?: string }> {
  const creditor_name = String(formData.get("creditor_name") ?? "").trim() || null;
  const creditor_address = String(formData.get("creditor_address") ?? "").trim() || null;
  const creditor_zip = String(formData.get("creditor_zip") ?? "").trim() || null;
  const creditor_city = String(formData.get("creditor_city") ?? "").trim() || null;
  const iban = String(formData.get("iban") ?? "").trim() || null;
  const twint_phone = String(formData.get("twint_phone") ?? "").trim() || null;

  const supabase = await createClient();
  const { error } = await supabase
    .from("settings")
    .update({ creditor_name, creditor_address, creditor_zip, creditor_city, iban, twint_phone })
    .eq("id", true);

  if (error) return { error: "L'enregistrement a échoué. Réessaie." };

  revalidatePath("/admin/reglages");
  return { ok: true };
}
