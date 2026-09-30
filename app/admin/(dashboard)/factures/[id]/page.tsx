import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import InvoiceForm from "../invoice-form";
import StatusControls from "./status-controls";

const STATUS_LABELS: Record<string, string> = {
  en_attente: "En attente",
  payee: "Payée",
  annulee: "Annulée",
};

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: invoice } = await supabase
    .from("invoices")
    .select("id, reference, tax_rate, items, status, due_date, client_id, clients(full_name)")
    .eq("id", id)
    .single();

  if (!invoice) notFound();

  const clientName = (invoice.clients as unknown as { full_name: string } | null)?.full_name ?? "—";

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="mb-1 font-sans text-[11px] uppercase tracking-[0.12em]" style={{ color: "rgba(13,11,8,0.45)" }}>
            {clientName}
          </p>
          <h1 className="font-display text-[26px]" style={{ color: "var(--noir)" }}>
            {invoice.reference}
          </h1>
        </div>
        <StatusControls invoiceId={invoice.id} clientId={invoice.client_id} status={invoice.status} labels={STATUS_LABELS} />
      </div>

      <InvoiceForm
        clientId={invoice.client_id}
        invoiceId={invoice.id}
        initial={{
          tax_rate: invoice.tax_rate,
          due_date: invoice.due_date ?? "",
          items: (invoice.items as { description: string; quantity: number; unit: string; unit_price: number }[]) ?? [],
        }}
      />
    </div>
  );
}
