"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createClientRecord(formData: FormData) {
  const full_name = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const address = String(formData.get("address") ?? "").trim() || null;

  if (!full_name) return;

  const supabase = await createClient();
  await supabase.from("clients").insert({ full_name, email, phone, address });
  revalidatePath("/admin/clients");
}

export async function deleteClientRecord(id: string) {
  const supabase = await createClient();
  await supabase.from("clients").delete().eq("id", id);
  revalidatePath("/admin/clients");
}

// Création depuis "Nouveau devis" / "Nouvelle facture" : renvoie l'id pour enchaîner.
export async function createClientFromPicker(input: {
  full_name: string;
  email: string;
  phone: string;
  address: string;
}): Promise<{ id?: string; error?: string }> {
  const full_name = input.full_name.trim();
  if (!full_name) return { error: "Le nom du client est obligatoire." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .insert({
      full_name,
      email: input.email.trim() || null,
      phone: input.phone.trim() || null,
      address: input.address.trim() || null,
    })
    .select("id")
    .single();

  if (error || !data) return { error: "Impossible de créer le client. Réessaie." };

  revalidatePath("/admin/clients");
  return { id: data.id };
}
