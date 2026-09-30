import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FileText, Receipt, Plus } from "@phosphor-icons/react/dist/ssr";

const STATUS_LABELS: Record<string, string> = {
  brouillon: "Brouillon",
  envoye: "Envoyé",
  accepte: "Accepté",
  refuse: "Refusé",
  en_attente: "En attente",
  payee: "Payée",
  annulee: "Annulée",
};

function chf(n: number) {
  return "CHF " + n.toLocaleString("fr-CH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function quoteTotal(items: unknown, taxRate: number) {
  const list = (items as { quantity: number; unit_price: number }[]) ?? [];
  const subtotal = list.reduce((s, it) => s + it.quantity * it.unit_price, 0);
  return subtotal * (1 + taxRate / 100);
}

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: client } = await supabase.from("clients").select("*").eq("id", id).single();
  if (!client) notFound();

  const [{ data: quotes }, { data: invoices }] = await Promise.all([
    supabase
      .from("quotes")
      .select("id, reference, title, status, tax_rate, items, created_at")
      .eq("client_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("invoices")
      .select("id, reference, status, tax_rate, items, created_at")
      .eq("client_id", id)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div>
      <Link href="/admin/clients" className="mb-4 inline-block font-sans text-[12.5px]" style={{ color: "rgba(13,11,8,0.5)" }}>
        ← Clients
      </Link>

      <div className="mb-8 rounded-2xl bg-white p-6" style={{ border: "1px solid rgba(13,11,8,0.08)" }}>
        <h1 className="mb-2 font-display text-[26px]" style={{ color: "var(--noir)" }}>
          {client.full_name}
        </h1>
        <p className="font-sans text-[13px]" style={{ color: "rgba(13,11,8,0.55)" }}>
          {[client.email, client.phone, client.address].filter(Boolean).join(" · ") || "—"}
        </p>
        {client.notes && (
          <p className="mt-3 rounded-xl px-4 py-3 font-sans text-[13px]" style={{ background: "var(--creme-2)", color: "rgba(13,11,8,0.6)" }}>
            {client.notes}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-sans text-[13.5px] font-semibold" style={{ color: "var(--noir)" }}>
              <FileText size={16} /> Devis
            </h2>
            <Link
              href={`/admin/devis/nouveau?client=${client.id}`}
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 font-sans text-[12px] font-medium"
              style={{ background: "var(--rose-deep)", color: "var(--creme)" }}
            >
              <Plus size={12} /> Nouveau
            </Link>
          </div>
          <div className="rounded-2xl bg-white" style={{ border: "1px solid rgba(13,11,8,0.08)" }}>
            {!quotes || quotes.length === 0 ? (
              <p className="px-4 py-6 text-center font-sans text-[13px]" style={{ color: "rgba(13,11,8,0.4)" }}>Aucun devis.</p>
            ) : (
              quotes.map((q, i) => (
                <Link
                  key={q.id}
                  href={`/admin/devis/${q.id}`}
                  className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-black/[0.02]"
                  style={{ borderTop: i > 0 ? "1px solid rgba(13,11,8,0.06)" : undefined }}
                >
                  <div>
                    <p className="font-sans text-[13.5px] font-medium" style={{ color: "var(--noir)" }}>{q.title || q.reference}</p>
                    <p className="font-sans text-[11.5px]" style={{ color: "rgba(13,11,8,0.45)" }}>{q.reference} · {STATUS_LABELS[q.status]}</p>
                  </div>
                  <p className="font-sans text-[13px] font-semibold" style={{ color: "var(--noir)" }}>{chf(quoteTotal(q.items, q.tax_rate))}</p>
                </Link>
              ))
            )}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-sans text-[13.5px] font-semibold" style={{ color: "var(--noir)" }}>
              <Receipt size={16} /> Factures
            </h2>
            <Link
              href={`/admin/factures/nouveau?client=${client.id}`}
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 font-sans text-[12px] font-medium"
              style={{ background: "var(--rose-deep)", color: "var(--creme)" }}
            >
              <Plus size={12} /> Nouvelle
            </Link>
          </div>
          <div className="rounded-2xl bg-white" style={{ border: "1px solid rgba(13,11,8,0.08)" }}>
            {!invoices || invoices.length === 0 ? (
              <p className="px-4 py-6 text-center font-sans text-[13px]" style={{ color: "rgba(13,11,8,0.4)" }}>Aucune facture.</p>
            ) : (
              invoices.map((inv, i) => (
                <Link
                  key={inv.id}
                  href={`/admin/factures/${inv.id}`}
                  className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-black/[0.02]"
                  style={{ borderTop: i > 0 ? "1px solid rgba(13,11,8,0.06)" : undefined }}
                >
                  <div>
                    <p className="font-sans text-[13.5px] font-medium" style={{ color: "var(--noir)" }}>{inv.reference}</p>
                    <p className="font-sans text-[11.5px]" style={{ color: "rgba(13,11,8,0.45)" }}>{STATUS_LABELS[inv.status]}</p>
                  </div>
                  <p className="font-sans text-[13px] font-semibold" style={{ color: "var(--noir)" }}>{chf(quoteTotal(inv.items, inv.tax_rate))}</p>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
