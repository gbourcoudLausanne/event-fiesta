"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
  input: { tax_rate: number; due_date: string | null; items: InvoiceItem[] },
) {
  const supabase = await createClient();
  await supabase
    .from("invoices")
    .update({
      tax_rate: input.tax_rate,
      due_date: input.due_date || null,
      items: input.items,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath(`/admin/factures/${id}`);
  revalidatePath("/admin/factures");
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
