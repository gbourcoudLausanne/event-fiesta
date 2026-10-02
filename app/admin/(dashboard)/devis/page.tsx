import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

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

function total(items: unknown, taxRate: number) {
  const list = (items as { quantity: number; unit_price: number }[]) ?? [];
  const subtotal = list.reduce((s, it) => s + it.quantity * it.unit_price, 0);
  return subtotal * (1 + taxRate / 100);
}

export default async function DevisListPage() {
  const supabase = await createClient();
  const { data: quotes } = await supabase
    .from("quotes")
    .select("id, reference, title, status, tax_rate, items, created_at, clients(full_name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-6 font-display text-[26px]" style={{ color: "var(--noir)" }}>
        Devis
      </h1>
      <div className="rounded-2xl bg-white" style={{ border: "1px solid rgba(13,11,8,0.08)" }}>
        {!quotes || quotes.length === 0 ? (
          <p className="px-5 py-8 text-center font-sans text-[13.5px]" style={{ color: "rgba(13,11,8,0.4)" }}>
            Aucun devis — crée-en un depuis une fiche client.
          </p>
        ) : (
          quotes.map((q, i) => (
            <Link
              key={q.id}
              href={`/admin/devis/${q.id}`}
              className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-black/[0.02]"
              style={{ borderTop: i > 0 ? "1px solid rgba(13,11,8,0.06)" : undefined }}
            >
              <div>
                <p className="font-sans text-[14px] font-semibold" style={{ color: "var(--noir)" }}>
                  {q.title || q.reference}
                </p>
                <p className="font-sans text-[12.5px]" style={{ color: "rgba(13,11,8,0.5)" }}>
                  {(q.clients as unknown as { full_name: string } | null)?.full_name ?? "—"} · {q.reference} · {STATUS_LABELS[q.status]}
                </p>
              </div>
              <p className="font-sans text-[14px] font-semibold" style={{ color: "var(--noir)" }}>
                {chf(total(q.items, q.tax_rate))}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
