import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FilePdf } from "@phosphor-icons/react/dist/ssr";
import QuoteForm from "../quote-form";
import StatusControls from "./status-controls";
import SendControls from "./send-controls";
import PaymentsPanel from "./payments-panel";
import { PAYMENT_COLUMNS, type QuotePayment } from "@/lib/quote-payments";
import type { ShareLang } from "@/lib/quote-share";
import LanguageControls from "./language-controls";

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
      "id, reference, title, event_type, event_date, venue, tax_rate, items, status, client_id, public_token, signed_by, signed_at, signature_data, deposit_percent, deposit_amount, balance_due_terms, payment_methods, pricing_mode, package_total, reference_images, client_language, translated_content, show_notes, notes_text, created_at, sent_at, clients(full_name, email, phone)",
    )
    .eq("id", id)
    .single();

  if (!quote) notFound();

  const { data: paymentRows } = await supabase
    .from("quote_payments")
    .select(PAYMENT_COLUMNS)
    .eq("quote_id", quote.id)
    .order("position");
  const payments = (paymentRows ?? []) as QuotePayment[];

  // Historique : chaque étape datée, du plus ancien au plus récent
  const history = [
    { at: quote.created_at as string, label: "Devis créé" },
    quote.sent_at && { at: quote.sent_at as string, label: "Envoyé au client" },
    quote.signed_at && { at: quote.signed_at as string, label: `Signé par ${quote.signed_by ?? "le client"}` },
    ...payments
      .filter((p) => p.status === "paye" && p.paid_at)
      .map((p) => ({
        at: p.paid_at as string,
        label: `${p.label?.trim() || (p.kind === "acompte" ? "Acompte" : p.kind === "solde" ? "Solde" : "Paiement")} reçu`,
      })),
  ]
    .filter((h): h is { at: string; label: string } => Boolean(h))
    .sort((a, b) => a.at.localeCompare(b.at));

  const clientRow = quote.clients as unknown as { full_name: string; email: string | null; phone: string | null } | null;
  const clientName = clientRow?.full_name ?? "—";
  const shareLang = ((quote.client_language as ShareLang | null) ?? "fr") as ShareLang;
  const translatedTitle = (quote.translated_content as { title?: string | null } | null)?.title;
  const shareTitle = (shareLang !== "fr" && translatedTitle) || quote.title || "Event Fiesta";

  return (
    <div>
      <div className="mb-4 flex md:justify-end">
        <LanguageControls quoteId={quote.id} clientLanguage={quote.client_language} />
      </div>

      <div className="mb-5 flex flex-col gap-3 md:mb-6 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <p className="mb-1 font-sans text-[11px] uppercase tracking-[0.12em]" style={{ color: "rgba(13,11,8,0.45)" }}>
            {quote.reference} · {clientName}
          </p>
          <h1 className="break-words font-display text-[23px] leading-tight md:text-[26px]" style={{ color: "var(--noir)" }}>
            {quote.title || "Devis sans titre"}
          </h1>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
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

      <div className="mb-6 rounded-2xl bg-white p-4 md:p-5" style={{ border: "1px solid rgba(13,11,8,0.08)" }}>
        {quote.signed_at ? (
          <div className="flex flex-wrap items-start justify-between gap-3">
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
          <SendControls
            quoteId={quote.id}
            link={`https://eventfiesta.ch/devis/${quote.public_token}`}
            title={shareTitle}
            lang={shareLang}
            clientName={clientName}
            clientEmail={clientRow?.email ?? null}
            clientPhone={clientRow?.phone ?? null}
          />
        )}
      </div>

      {(quote.signed_at || quote.status === "accepte") && (
        <PaymentsPanel
          quoteId={quote.id}
          payments={payments}
          balanceTerms={quote.balance_due_terms}
          hasClientEmail={!!clientRow?.email}
        />
      )}

      <details className="mb-6 rounded-2xl bg-white px-4 py-3 md:px-5" style={{ border: "1px solid rgba(13,11,8,0.08)" }}>
        <summary className="cursor-pointer font-sans text-[13px] font-semibold" style={{ color: "var(--noir)" }}>
          Historique
        </summary>
        <ol className="mt-3 flex flex-col gap-2 pb-1">
          {history.map((h, i) => (
            <li key={i} className="flex items-baseline justify-between gap-3 font-sans text-[12.5px]">
              <span style={{ color: "var(--noir)" }}>{h.label}</span>
              <span className="shrink-0" style={{ color: "rgba(13,11,8,0.45)" }}>
                {new Date(h.at).toLocaleString("fr-CH", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Zurich" })}
              </span>
            </li>
          ))}
        </ol>
      </details>

      <QuoteForm
        clientId={quote.client_id}
        quoteId={quote.id}
        initial={{
          title: quote.title ?? "",
          event_type: quote.event_type ?? "",
          event_date: quote.event_date ?? "",
          venue: quote.venue ?? "",
          tax_rate: quote.tax_rate,
          items: (quote.items as { title?: string; description: string; quantity: number; unit: string; unit_price: number }[]) ?? [],
          deposit_percent: quote.deposit_percent,
          deposit_amount: quote.deposit_amount,
          balance_due_terms: quote.balance_due_terms ?? "",
          payment_methods: quote.payment_methods ?? [],
          pricing_mode: (quote.pricing_mode as "detaille" | "forfait") ?? "detaille",
          package_total: quote.package_total,
          reference_images: quote.reference_images ?? [],
          show_notes: quote.show_notes ?? true,
          notes_text: quote.notes_text,
        }}
      />
    </div>
  );
}
