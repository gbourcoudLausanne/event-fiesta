"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { allSupplements, type Supplement } from "@/lib/quote-supplements";

async function revalidateAll(quoteId: string, token: string | null) {
  revalidatePath(`/admin/devis/${quoteId}`);
  revalidatePath("/admin/devis");
  revalidatePath("/admin/paiements");
  revalidatePath("/admin");
  if (token) revalidatePath(`/devis/${token}`);
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

// Ajoute une ligne au devis signé et ajuste ce qu'il reste à payer :
// montant ajouté au solde s'il n'est pas encore payé, sinon nouvelle étape « Supplément ».
export async function addSupplement(quoteId: string, input: { description: string; amount: number }): Promise<{ error?: string }> {
  const description = input.description.trim();
  const amount = round2(input.amount);
  if (!description) return { error: "Décris l'ajout (ex : 2 arches supplémentaires)." };
  if (!(amount > 0)) return { error: "Indique un montant." };

  const supabase = await createClient();
  const { data: q } = await supabase.from("quotes").select("id, public_token, supplements").eq("id", quoteId).single();
  if (!q) return { error: "Devis introuvable." };

  let paymentId: string | null = null;
  let paymentMode: Supplement["payment_mode"] = null;

  const { data: payments } = await supabase
    .from("quote_payments")
    .select("id, kind, amount, status, position")
    .eq("quote_id", quoteId)
    .order("position");

  if (payments && payments.length > 0) {
    const openBalance = payments.find((p) => p.kind === "solde" && p.status === "a_payer");
    if (openBalance) {
      await supabase.from("quote_payments").update({ amount: round2(Number(openBalance.amount) + amount) }).eq("id", openBalance.id);
      paymentId = openBalance.id;
      paymentMode = "added_to";
    } else {
      const { data: created } = await supabase
        .from("quote_payments")
        .insert({
          quote_id: quoteId,
          position: Math.max(...payments.map((p) => p.position)) + 1,
          kind: "autre",
          label: "Supplément",
          amount,
          status: "a_payer",
        })
        .select("id")
        .single();
      paymentId = created?.id ?? null;
      paymentMode = "created";
    }
  }
  // Pas encore d'échéancier : il sera créé plus tard avec le total qui inclut l'ajout.

  const supplement: Supplement = {
    id: crypto.randomUUID(),
    description,
    amount,
    added_at: new Date().toISOString(),
    accepted_at: null,
    removed_at: null,
    payment_id: paymentId,
    payment_mode: paymentMode,
  };
  const { error } = await supabase
    .from("quotes")
    .update({ supplements: [...allSupplements(q.supplements), supplement] })
    .eq("id", quoteId);
  if (error) return { error: "L'ajout n'a pas pu être enregistré." };

  await revalidateAll(quoteId, q.public_token);
  return {};
}

// Retire un ajout (il reste dans l'historique) et annule son effet sur les paiements.
export async function removeSupplement(quoteId: string, supplementId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: q } = await supabase.from("quotes").select("id, public_token, supplements").eq("id", quoteId).single();
  if (!q) return { error: "Devis introuvable." };

  const list = allSupplements(q.supplements);
  const sup = list.find((s) => s.id === supplementId && !s.removed_at);
  if (!sup) return { error: "Ajout introuvable." };

  if (sup.payment_id) {
    const { data: pay } = await supabase.from("quote_payments").select("id, amount, status").eq("id", sup.payment_id).maybeSingle();
    if (pay?.status === "paye") return { error: "Cet ajout est déjà payé : modifie plutôt l'étape de paiement." };
    if (pay && sup.payment_mode === "created") {
      await supabase.from("quote_payments").delete().eq("id", pay.id);
    } else if (pay && sup.payment_mode === "added_to") {
      await supabase.from("quote_payments").update({ amount: Math.max(0, round2(Number(pay.amount) - Number(sup.amount))) }).eq("id", pay.id);
    }
  }

  const { error } = await supabase
    .from("quotes")
    .update({ supplements: list.map((s) => (s.id === supplementId ? { ...s, removed_at: new Date().toISOString() } : s)) })
    .eq("id", quoteId);
  if (error) return { error: "Le retrait n'a pas pu être enregistré." };

  await revalidateAll(quoteId, q.public_token);
  return {};
}
