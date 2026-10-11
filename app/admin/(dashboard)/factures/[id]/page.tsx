import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import InvoiceForm from "../invoice-form";
import StatusControls from "./status-controls";
import InvoiceSendControls from "./invoice-send-controls";

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
    .select("id, reference, tax_rate, items, status, due_date, client_id, quote_id, public_token, deduct_payments, clients(full_name, email, phone), quotes(id, reference)")
    .eq("id", id)
    .single();

  if (!invoice) notFound();

  const clientRow = invoice.clients as unknown as { full_name: string; email: string | null; phone: string | null } | null;
  const clientName = clientRow?.full_name ?? "—";
  const linkedQuote = invoice.quotes as unknown as { id: string; reference: string } | null;

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between md:mb-6">
        <div className="min-w-0">
          <p className="mb-1 font-sans text-[11px] uppercase tracking-[0.12em]" style={{ color: "rgba(13,11,8,0.45)" }}>
            {clientName}
          </p>
          <h1 className="font-display text-[23px] md:text-[26px]" style={{ color: "var(--noir)" }}>
            {invoice.reference}
          </h1>
        </div>
        <StatusControls invoiceId={invoice.id} clientId={invoice.client_id} status={invoice.status} labels={STATUS_LABELS} />
      </div>

      {linkedQuote && (
        <Link
          href={`/admin/devis/${linkedQuote.id}`}
          className="mb-4 flex items-center justify-between gap-3 rounded-2xl px-4 py-3 font-sans text-[13px]"
          style={{ background: "var(--creme-2)", color: "var(--noir)" }}
        >
          <span>
            Liée au devis <strong>{linkedQuote.reference}</strong>
          </span>
          <span style={{ color: "var(--rose-deep)" }}>Ouvrir le devis →</span>
        </Link>
      )}

      <InvoiceSendControls
        invoiceId={invoice.id}
        reference={invoice.reference}
        link={`https://eventfiesta.ch/facture/${invoice.public_token}/pdf`}
        clientName={clientName}
        clientEmail={clientRow?.email ?? null}
        clientPhone={clientRow?.phone ?? null}
      />

      <InvoiceForm
        clientId={invoice.client_id}
        invoiceId={invoice.id}
        hasQuote={!!linkedQuote}
        initial={{
          tax_rate: invoice.tax_rate,
          due_date: invoice.due_date ?? "",
          deduct_payments: invoice.deduct_payments ?? true,
          items: (invoice.items as { description: string; quantity: number; unit: string; unit_price: number }[]) ?? [],
        }}
      />
    </div>
  );
}
