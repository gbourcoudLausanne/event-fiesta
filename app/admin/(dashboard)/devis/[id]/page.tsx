import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FilePdf } from "@phosphor-icons/react/dist/ssr";
import QuoteForm from "../quote-form";
import StatusControls from "./status-controls";
import CopyLinkButton from "./copy-link-button";

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-CH", { day: "numeric", month: "long", year: "numeric" });
}

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
    .select(
      "id, reference, title, event_type, event_date, venue, tax_rate, items, status, client_id, public_token, signed_by, signed_at, signature_data, deposit_percent, balance_due_terms, payment_methods, clients(full_name)",
    )
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
        <div className="flex items-center gap-2">
          <a
            href={`/api/devis/${quote.id}/pdf`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-sans text-[13px] font-medium transition-colors hover:bg-black/5"
            style={{ border: "1px solid rgba(13,11,8,0.14)", color: "var(--noir)" }}
          >
            <FilePdf size={15} /> Aperçu PDF
          </a>
          <StatusControls quoteId={quote.id} clientId={quote.client_id} status={quote.status} labels={STATUS_LABELS} />
        </div>
      </div>

      <div className="mb-6 rounded-2xl bg-white p-5" style={{ border: "1px solid rgba(13,11,8,0.08)" }}>
        {quote.signed_at ? (
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-sans text-[13.5px] font-semibold" style={{ color: "var(--noir)" }}>
                ✓ Accepté et signé
              </p>
              <p className="font-sans text-[12.5px]" style={{ color: "rgba(13,11,8,0.5)" }}>
                Par {quote.signed_by} le {fmtDate(quote.signed_at)}
              </p>
            </div>
            {quote.signature_data && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={quote.signature_data} alt="Signature du client" className="h-14 rounded-lg" style={{ background: "var(--creme-2)" }} />
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-sans text-[13.5px] font-semibold" style={{ color: "var(--noir)" }}>
                Lien de signature client
              </p>
              <p className="font-sans text-[12px]" style={{ color: "rgba(13,11,8,0.5)" }}>
                Envoie ce lien pour que le client consulte et signe le devis en ligne.
              </p>
            </div>
            <CopyLinkButton link={`https://eventfiesta.ch/devis/${quote.public_token}`} />
          </div>
        )}
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
          deposit_percent: quote.deposit_percent,
          balance_due_terms: quote.balance_due_terms ?? "",
          payment_methods: quote.payment_methods ?? [],
        }}
      />
    </div>
  );
}
