import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus } from "@phosphor-icons/react/dist/ssr";

const STATUS_LABELS: Record<string, string> = {
  brouillon: "Brouillon",
  envoye: "Envoyé",
  accepte: "Accepté",
  refuse: "Refusé",
};

function chf(n: number) {
  const [intPart, decPart] = n.toFixed(2).split(".");
  return `CHF ${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'")},${decPart}`;
}

function total(items: unknown, taxRate: number, pricingMode: string | null, packageTotal: number | null) {
  if (pricingMode === "forfait") return packageTotal ?? 0;
  const list = (items as { quantity: number; unit_price: number }[]) ?? [];
  const subtotal = list.reduce((s, it) => s + it.quantity * it.unit_price, 0);
  return subtotal * (1 + taxRate / 100);
}

export default async function DevisListPage() {
  const supabase = await createClient();
  const { data: quotes } = await supabase
    .from("quotes")
    .select("id, reference, title, status, tax_rate, items, pricing_mode, package_total, created_at, clients(full_name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3 md:mb-6">
        <h1 className="font-display text-[23px] md:text-[26px]" style={{ color: "var(--noir)" }}>
          Devis
        </h1>
        <Link
          href="/admin/devis/nouveau"
          className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 font-sans text-[13px] font-medium md:py-2"
          style={{ background: "var(--rose-deep)", color: "var(--creme)" }}
        >
          <Plus size={14} weight="bold" /> Nouveau devis
        </Link>
      </div>
      <div className="rounded-2xl bg-white" style={{ border: "1px solid rgba(13,11,8,0.08)" }}>
        {!quotes || quotes.length === 0 ? (
          <p className="px-5 py-8 text-center font-sans text-[13.5px]" style={{ color: "rgba(13,11,8,0.4)" }}>
            Aucun devis pour l&apos;instant — appuie sur « Nouveau devis ».
          </p>
        ) : (
          quotes.map((q, i) => (
            <Link
              key={q.id}
              href={`/admin/devis/${q.id}`}
              className="flex items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:bg-black/[0.02] md:px-5 md:py-4"
              style={{ borderTop: i > 0 ? "1px solid rgba(13,11,8,0.06)" : undefined }}
            >
              <div className="min-w-0">
                <p className="truncate font-sans text-[14px] font-semibold" style={{ color: "var(--noir)" }}>
                  {q.title || q.reference}
                </p>
                <p className="truncate font-sans text-[12.5px]" style={{ color: "rgba(13,11,8,0.5)" }}>
                  {(q.clients as unknown as { full_name: string } | null)?.full_name ?? "—"} · {q.reference} · {STATUS_LABELS[q.status]}
                </p>
              </div>
              <p className="shrink-0 whitespace-nowrap font-sans text-[13.5px] font-semibold md:text-[14px]" style={{ color: "var(--noir)" }}>
                {chf(total(q.items, q.tax_rate, q.pricing_mode, q.package_total))}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
