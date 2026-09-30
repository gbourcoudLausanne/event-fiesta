import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import QuoteForm from "../quote-form";
import StatusControls from "./status-controls";

const STATUS_LABELS: Record<string, string> = {
  brouillon: "Brouillon",
  envoye: "Envoyé",
  accepte: "Accepté",
  refuse: "Refusé",
};

export default async function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: quote } = await supabase
    .from("quotes")
    .select("id, reference, title, event_type, event_date, venue, tax_rate, items, status, client_id, clients(full_name)")
    .eq("id", id)
    .single();

  if (!quote) notFound();

  const clientName = (quote.clients as unknown as { full_name: string } | null)?.full_name ?? "—";

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="mb-1 font-sans text-[11px] uppercase tracking-[0.12em]" style={{ color: "rgba(13,11,8,0.45)" }}>
            {quote.reference} · {clientName}
          </p>
          <h1 className="font-display text-[26px]" style={{ color: "var(--noir)" }}>
            {quote.title || "Devis sans titre"}
          </h1>
        </div>
        <StatusControls quoteId={quote.id} clientId={quote.client_id} status={quote.status} labels={STATUS_LABELS} />
      </div>

      <QuoteForm
        clientId={quote.client_id}
        quoteId={quote.id}
        initial={{
          title: quote.title ?? "",
          event_type: quote.event_type ?? "",
          event_date: quote.event_date ?? "",
          venue: quote.venue ?? "",
          tax_rate: quote.tax_rate,
          items: (quote.items as { description: string; quantity: number; unit: string; unit_price: number }[]) ?? [],
        }}
      />
    </div>
  );
}
