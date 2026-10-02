"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type QuoteItem = {
  title?: string;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
};

function generateReference() {
  const year = new Date().getFullYear();
  const n = Math.floor(1000 + Math.random() * 9000);
  return `D-${year}-${n}`;
}

export async function createQuote(input: {
  client_id: string;
  title: string;
  event_type: string;
  event_date: string | null;
  venue: string;
  tax_rate: number;
  items: QuoteItem[];
  deposit_percent: number | null;
  deposit_amount: number | null;
  balance_due_terms: string | null;
  payment_methods: string[];
  pricing_mode: "detaille" | "forfait";
  package_total: number | null;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quotes")
    .insert({
      client_id: input.client_id,
      reference: generateReference(),
      title: input.title || null,
      event_type: input.event_type || null,
      event_date: input.event_date || null,
      venue: input.venue || null,
      tax_rate: input.tax_rate,
      items: input.items,
      deposit_percent: input.deposit_percent,
      deposit_amount: input.deposit_amount,
      balance_due_terms: input.balance_due_terms,
      payment_methods: input.payment_methods,
      pricing_mode: input.pricing_mode,
      package_total: input.package_total,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: "Impossible de créer le devis." };
  }

  revalidatePath("/admin/devis");
  revalidatePath(`/admin/clients/${input.client_id}`);
  redirect(`/admin/devis/${data.id}`);
}

export async function updateQuote(
  id: string,
  input: {
    title: string;
    event_type: string;
    event_date: string | null;
    venue: string;
    tax_rate: number;
    items: QuoteItem[];
    deposit_percent: number | null;
    deposit_amount: number | null;
    balance_due_terms: string | null;
    payment_methods: string[];
    pricing_mode: "detaille" | "forfait";
    package_total: number | null;
  },
) {
  const supabase = await createClient();
  await supabase
    .from("quotes")
    .update({
      title: input.title || null,
      event_type: input.event_type || null,
      event_date: input.event_date || null,
      venue: input.venue || null,
      tax_rate: input.tax_rate,
      items: input.items,
      deposit_percent: input.deposit_percent,
      deposit_amount: input.deposit_amount,
      balance_due_terms: input.balance_due_terms,
      payment_methods: input.payment_methods,
      pricing_mode: input.pricing_mode,
      package_total: input.package_total,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath(`/admin/devis/${id}`);
  revalidatePath("/admin/devis");
}

export async function updateQuoteStatus(id: string, status: string) {
  const supabase = await createClient();
  await supabase.from("quotes").update({ status }).eq("id", id);
  revalidatePath(`/admin/devis/${id}`);
  revalidatePath("/admin/devis");
}

export async function deleteQuote(id: string, clientId: string | null) {
  const supabase = await createClient();
  await supabase.from("quotes").delete().eq("id", id);
  revalidatePath("/admin/devis");
  if (clientId) revalidatePath(`/admin/clients/${clientId}`);
  redirect(clientId ? `/admin/clients/${clientId}` : "/admin/devis");
}
