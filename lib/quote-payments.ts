import type { SupabaseClient } from "@supabase/supabase-js";
import { supplementsTotal } from "@/lib/quote-supplements";

// Suivi des paiements d'un devis : acompte + solde, générés à la signature.

export type QuotePayment = {
  id: string;
  quote_id: string;
  position: number;
  kind: "acompte" | "solde" | "autre";
  label: string | null;
  amount: number;
  due_label: string | null;
  status: "a_payer" | "paye";
  paid_at: string | null;
  method: "twint" | "virement" | "especes" | "carte" | null;
};

export const PAYMENT_COLUMNS = "id, quote_id, position, kind, label, amount, due_label, status, paid_at, method";

type QuoteMoney = {
  items: unknown;
  tax_rate: number;
  pricing_mode: string | null;
  package_total: number | null;
  deposit_percent: number | null;
  deposit_amount: number | null;
  supplements?: unknown;
};

// Total du devis signé, sans les ajouts
export function baseQuoteTotal(q: QuoteMoney) {
  if (q.pricing_mode === "forfait") return q.package_total ?? 0;
  const items = (q.items as { quantity: number; unit_price: number }[] | null) ?? [];
  const subtotal = items.reduce((s, it) => s + it.quantity * it.unit_price, 0);
  return subtotal * (1 + q.tax_rate / 100);
}

// Total actuel : devis + ajouts après signature
export function quoteTotal(q: QuoteMoney) {
  return baseQuoteTotal(q) + supplementsTotal(q.supplements);
}

export function quoteDeposit(q: QuoteMoney, total = baseQuoteTotal(q)) {
  if (q.deposit_amount && q.deposit_amount > 0) return Math.min(q.deposit_amount, total);
  if (q.deposit_percent && q.deposit_percent > 0) return Math.round(total * q.deposit_percent) / 100;
  return 0;
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

// Crée l'échéancier (acompte + solde) s'il n'existe pas encore. Idempotent.
export async function ensurePaymentSchedule(supabase: SupabaseClient, quoteId: string) {
  const { count } = await supabase
    .from("quote_payments")
    .select("id", { count: "exact", head: true })
    .eq("quote_id", quoteId);
  if (count && count > 0) return;

  const { data: q } = await supabase
    .from("quotes")
    .select("items, tax_rate, pricing_mode, package_total, deposit_percent, deposit_amount, supplements")
    .eq("id", quoteId)
    .single();
  if (!q) return;

  const total = round2(quoteTotal(q));
  const deposit = round2(quoteDeposit(q));
  const rows =
    deposit > 0 && deposit < total
      ? [
          { quote_id: quoteId, position: 0, kind: "acompte", amount: deposit },
          { quote_id: quoteId, position: 1, kind: "solde", amount: round2(total - deposit) },
        ]
      : [{ quote_id: quoteId, position: 0, kind: deposit >= total && total > 0 ? "acompte" : "solde", amount: total }];

  await supabase.from("quote_payments").insert(rows);
}

export function remainingAmount(payments: Pick<QuotePayment, "amount" | "status">[]) {
  return round2(payments.filter((p) => p.status !== "paye").reduce((s, p) => s + Number(p.amount), 0));
}
