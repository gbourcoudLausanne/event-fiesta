import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PAYMENT_COLUMNS, type QuotePayment } from "@/lib/quote-payments";
import { PaymentRow } from "../devis/[id]/payments-panel";
import MoneyTabs from "../money-tabs";

const METHOD_LABEL: Record<string, string> = { twint: "Twint", virement: "Virement", especes: "Espèces", carte: "Carte" };
const KIND_LABEL: Record<string, string> = { acompte: "Acompte", solde: "Solde", autre: "Paiement" };

type Row = QuotePayment & {
  quotes: {
    id: string;
    reference: string;
    title: string | null;
    event_date: string | null;
    balance_due_terms: string | null;
    clients: { full_name: string; email: string | null } | null;
  } | null;
};

function chf(n: number) {
  const [intPart, decPart] = n.toFixed(2).split(".");
  return `CHF ${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'")},${decPart}`;
}

function zurichDate(iso: string) {
  return new Date(iso).toLocaleDateString("sv-SE", { timeZone: "Europe/Zurich" }); // AAAA-MM-JJ
}

export default async function PaiementsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("quote_payments")
    .select(`${PAYMENT_COLUMNS}, quotes(id, reference, title, event_date, balance_due_terms, clients(full_name, email))`)
    .order("position");
  const rows = (data ?? []) as unknown as Row[];

  const today = zurichDate(new Date().toISOString());
  const thisMonth = today.slice(0, 7);
  const thisYear = today.slice(0, 4);

  const due = rows
    .filter((r) => r.status !== "paye" && Number(r.amount) > 0)
    .sort((a, b) => (a.quotes?.event_date ?? "9999").localeCompare(b.quotes?.event_date ?? "9999") || a.position - b.position);
  const paid = rows
    .filter((r) => r.status === "paye" && r.paid_at)
    .sort((a, b) => (b.paid_at as string).localeCompare(a.paid_at as string));

  const totalDue = due.reduce((s, r) => s + Number(r.amount), 0);
  const paidMonth = paid.filter((r) => zurichDate(r.paid_at as string).startsWith(thisMonth)).reduce((s, r) => s + Number(r.amount), 0);
  const paidYear = paid.filter((r) => zurichDate(r.paid_at as string).startsWith(thisYear)).reduce((s, r) => s + Number(r.amount), 0);

  // Encaissements groupés par mois
  const byMonth = new Map<string, Row[]>();
  for (const r of paid) {
    const key = zurichDate(r.paid_at as string).slice(0, 7);
    byMonth.set(key, [...(byMonth.get(key) ?? []), r]);
  }

  const card = { border: "1px solid rgba(13,11,8,0.08)" };

  return (
    <div>
      <h1 className="mb-4 font-display text-[23px] md:text-[26px]" style={{ color: "var(--noir)" }}>
        Paiements
      </h1>
      <MoneyTabs active="paiements" />

      <div className="mb-6 grid grid-cols-3 gap-2 md:gap-4">
        {[
          { label: "À encaisser", value: totalDue, color: totalDue > 0 ? "var(--rose-deep)" : "var(--noir)" },
          { label: "Encaissé ce mois", value: paidMonth, color: "#3B7D55" },
          { label: `Encaissé ${thisYear}`, value: paidYear, color: "var(--noir)" },
        ].map((s) => (
          <div key={s.label} className="flex flex-col justify-between rounded-2xl bg-white px-3 py-3 md:px-5 md:py-4" style={card}>
            <p className="mb-1 font-sans text-[10px] uppercase tracking-[0.1em] md:text-[11px]" style={{ color: "rgba(13,11,8,0.45)" }}>
              {s.label}
            </p>
            <p className="font-display text-[17px] leading-tight md:text-[26px]" style={{ color: s.color }}>
              {chf(s.value).replace("CHF ", "")}
              <span className="ml-1 font-sans text-[10px] md:text-[12px]" style={{ color: "rgba(13,11,8,0.4)" }}>CHF</span>
            </p>
          </div>
        ))}
      </div>

      <h2 className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: "rgba(13,11,8,0.5)" }}>
        À encaisser · {due.length}
      </h2>
      <div className="mb-8 rounded-2xl bg-white px-4 md:px-5" style={card}>
        {due.length === 0 ? (
          <p className="py-6 text-center font-sans text-[13.5px]" style={{ color: "rgba(13,11,8,0.45)" }}>Rien en attente. 🎉</p>
        ) : (
          due.map((r, i) => (
            <div key={r.id} className="pt-3" style={{ borderTop: i > 0 ? "1px solid rgba(13,11,8,0.08)" : undefined }}>
              <Link href={`/admin/devis/${r.quotes?.id}`} className="flex items-baseline justify-between gap-3">
                <span className="truncate font-sans text-[12px] font-semibold uppercase tracking-[0.06em]" style={{ color: "var(--rose-deep)" }}>
                  {r.quotes?.clients?.full_name ?? "—"}
                </span>
                <span className="shrink-0 font-sans text-[11.5px]" style={{ color: "rgba(13,11,8,0.45)" }}>
                  {r.quotes?.reference}
                  {r.quotes?.event_date
                    ? ` · ${new Date(`${r.quotes.event_date}T12:00:00Z`).toLocaleDateString("fr-CH", { day: "numeric", month: "short", timeZone: "UTC" })}`
                    : ""}
                </span>
              </Link>
              <PaymentRow p={r} balanceTerms={r.quotes?.balance_due_terms ?? null} hasClientEmail={!!r.quotes?.clients?.email} noBorder />
            </div>
          ))
        )}
      </div>

      <h2 className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: "rgba(13,11,8,0.5)" }}>
        Encaissé
      </h2>
      {paid.length === 0 ? (
        <div className="rounded-2xl bg-white px-5 py-6 text-center font-sans text-[13.5px]" style={{ ...card, color: "rgba(13,11,8,0.45)" }}>
          Aucun paiement reçu pour l&apos;instant.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {[...byMonth.entries()].map(([month, list]) => {
            const label = new Date(`${month}-15T12:00:00Z`).toLocaleDateString("fr-CH", { month: "long", year: "numeric", timeZone: "UTC" });
            return (
              <div key={month} className="rounded-2xl bg-white" style={card}>
                <div className="flex items-baseline justify-between px-4 py-3 md:px-5" style={{ borderBottom: "1px solid rgba(13,11,8,0.06)" }}>
                  <p className="font-sans text-[13px] font-semibold capitalize" style={{ color: "var(--noir)" }}>{label}</p>
                  <p className="font-sans text-[13px] font-semibold" style={{ color: "#3B7D55" }}>
                    {chf(list.reduce((s, r) => s + Number(r.amount), 0))}
                  </p>
                </div>
                {list.map((r, i) => (
                  <Link
                    key={r.id}
                    href={`/admin/devis/${r.quotes?.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 transition-colors hover:bg-black/[0.02] md:px-5"
                    style={{ borderTop: i > 0 ? "1px solid rgba(13,11,8,0.05)" : undefined }}
                  >
                    <div className="min-w-0">
                      <p className="truncate font-sans text-[13.5px] font-medium" style={{ color: "var(--noir)" }}>
                        {r.quotes?.clients?.full_name ?? "—"}
                      </p>
                      <p className="truncate font-sans text-[12px]" style={{ color: "rgba(13,11,8,0.5)" }}>
                        {r.label?.trim() || KIND_LABEL[r.kind]} ·{" "}
                        {new Date(r.paid_at as string).toLocaleDateString("fr-CH", { day: "numeric", month: "short", timeZone: "Europe/Zurich" })}
                        {r.method ? ` · ${METHOD_LABEL[r.method]}` : ""}
                      </p>
                    </div>
                    <span className="shrink-0 whitespace-nowrap font-sans text-[13.5px] font-semibold" style={{ color: "var(--noir)" }}>
                      {chf(Number(r.amount))}
                    </span>
                  </Link>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
