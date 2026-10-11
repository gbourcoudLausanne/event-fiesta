import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus } from "@phosphor-icons/react/dist/ssr";

const STATUS_LABELS: Record<string, string> = {
  en_attente: "En attente",
  payee: "Payée",
  annulee: "Annulée",
};

function chf(n: number) {
  const [intPart, decPart] = n.toFixed(2).split(".");
  return `CHF ${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'")},${decPart}`;
}

function total(items: unknown, taxRate: number) {
  const list = (items as { quantity: number; unit_price: number }[]) ?? [];
  const subtotal = list.reduce((s, it) => s + it.quantity * it.unit_price, 0);
  return subtotal * (1 + taxRate / 100);
}

export default async function FacturesListPage() {
  const supabase = await createClient();
  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, reference, status, tax_rate, items, created_at, clients(full_name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3 md:mb-6">
        <h1 className="font-display text-[23px] md:text-[26px]" style={{ color: "var(--noir)" }}>
          Factures
        </h1>
        <Link
          href="/admin/factures/nouveau"
          className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 font-sans text-[13px] font-medium md:py-2"
          style={{ background: "var(--rose-deep)", color: "var(--creme)" }}
        >
          <Plus size={14} weight="bold" /> Nouvelle facture
        </Link>
      </div>
      <div className="rounded-2xl bg-white" style={{ border: "1px solid rgba(13,11,8,0.08)" }}>
        {!invoices || invoices.length === 0 ? (
          <p className="px-5 py-8 text-center font-sans text-[13.5px]" style={{ color: "rgba(13,11,8,0.4)" }}>
            Aucune facture pour l&apos;instant — appuie sur « Nouvelle facture ».
          </p>
        ) : (
          invoices.map((inv, i) => (
            <Link
              key={inv.id}
              href={`/admin/factures/${inv.id}`}
              className="flex items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:bg-black/[0.02] md:px-5 md:py-4"
              style={{ borderTop: i > 0 ? "1px solid rgba(13,11,8,0.06)" : undefined }}
            >
              <div className="min-w-0">
                <p className="truncate font-sans text-[14px] font-semibold" style={{ color: "var(--noir)" }}>
                  {inv.reference}
                </p>
                <p className="truncate font-sans text-[12.5px]" style={{ color: "rgba(13,11,8,0.5)" }}>
                  {(inv.clients as unknown as { full_name: string } | null)?.full_name ?? "—"} · {STATUS_LABELS[inv.status]}
                </p>
              </div>
              <p className="shrink-0 whitespace-nowrap font-sans text-[13.5px] font-semibold md:text-[14px]" style={{ color: "var(--noir)" }}>
                {chf(total(inv.items, inv.tax_rate))}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
