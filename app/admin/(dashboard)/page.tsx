import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

function chf(n: number) {
  const [intPart, decPart] = n.toFixed(2).split(".");
  return `CHF ${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'")},${decPart}`;
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("fr-CH", { day: "numeric", month: "short", year: "numeric" });
}

type DuePayment = {
  id: string;
  kind: string;
  label: string | null;
  amount: number;
  quotes: { id: string; reference: string; event_date: string | null; clients: { full_name: string } | null } | null;
};

async function getToCollect() {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const [{ data: due }, { data: events }] = await Promise.all([
    supabase
      .from("quote_payments")
      .select("id, kind, label, amount, quotes(id, reference, event_date, clients(full_name))")
      .eq("status", "a_payer")
      .gt("amount", 0)
      .order("position"),
    supabase
      .from("quotes")
      .select("id, title, event_date, clients(full_name)")
      .eq("status", "accepte")
      .gte("event_date", today)
      .order("event_date")
      .limit(5),
  ]);
  const payments = ((due ?? []) as unknown as DuePayment[]).sort((a, b) =>
    (a.quotes?.event_date ?? "9999").localeCompare(b.quotes?.event_date ?? "9999"),
  );
  return {
    payments,
    total: payments.reduce((s, p) => s + Number(p.amount), 0),
    events: (events ?? []) as unknown as { id: string; title: string | null; event_date: string; clients: { full_name: string } | null }[],
  };
}

async function getCounts() {
  const supabase = await createClient();

  const [clients, quotesPending, invoicesUnpaid, webClients, allQuotes] = await Promise.all([
    supabase.from("clients").select("id", { count: "exact", head: true }),
    supabase
      .from("quotes")
      .select("id", { count: "exact", head: true })
      .eq("status", "envoye"),
    supabase
      .from("invoices")
      .select("id", { count: "exact", head: true })
      .eq("status", "en_attente"),
    supabase.from("clients").select("id").eq("source", "site_web"),
    supabase.from("quotes").select("client_id"),
  ]);

  // "Nouvelle demande" = client arrivé via le site, pas encore devisé.
  const quotedClientIds = new Set((allQuotes.data ?? []).map((q) => q.client_id));
  const newRequests = (webClients.data ?? []).filter((c) => !quotedClientIds.has(c.id)).length;

  return {
    clients: clients.count ?? 0,
    quotesPending: quotesPending.count ?? 0,
    invoicesUnpaid: invoicesUnpaid.count ?? 0,
    newRequests,
  };
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div
      className="flex flex-col justify-between rounded-2xl bg-white px-4 py-4 md:px-6 md:py-5"
      style={{ border: "1px solid rgba(13,11,8,0.08)" }}
    >
      <p
        className="mb-2 font-sans text-[11px] uppercase tracking-[0.12em]"
        style={{ color: "rgba(13,11,8,0.45)" }}
      >
        {label}
      </p>
      <p className="font-display text-[28px] md:text-[32px]" style={{ color: "var(--noir)" }}>
        {value}
      </p>
    </div>
  );
}

export default async function AdminOverviewPage() {
  const [counts, collect] = await Promise.all([getCounts(), getToCollect()]);

  return (
    <div>
      <h1 className="mb-6 font-display text-[23px] md:text-[26px]" style={{ color: "var(--noir)" }}>
        Vue d&apos;ensemble
      </h1>
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <StatCard label="Nouvelles demandes" value={counts.newRequests} />
        <StatCard label="Clients" value={counts.clients} />
        <StatCard label="Devis en attente" value={counts.quotesPending} />
        <StatCard label="Factures impayées" value={counts.invoicesUnpaid} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-4 md:p-5" style={{ border: "1px solid rgba(13,11,8,0.08)" }}>
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 className="font-sans text-[13.5px] font-semibold" style={{ color: "var(--noir)" }}>À encaisser</h2>
            <span className="font-display text-[22px]" style={{ color: collect.total > 0 ? "var(--rose-deep)" : "var(--noir)" }}>
              {chf(collect.total)}
            </span>
          </div>
          {collect.payments.length === 0 ? (
            <p className="font-sans text-[13px]" style={{ color: "rgba(13,11,8,0.45)" }}>Rien en attente.</p>
          ) : (
            collect.payments.map((p, i) => (
              <Link
                key={p.id}
                href={`/admin/devis/${p.quotes?.id}`}
                className="flex items-center justify-between gap-3 py-2.5"
                style={{ borderTop: i > 0 ? "1px solid rgba(13,11,8,0.06)" : undefined }}
              >
                <div className="min-w-0">
                  <p className="truncate font-sans text-[13.5px] font-medium" style={{ color: "var(--noir)" }}>
                    {p.quotes?.clients?.full_name ?? "—"}
                  </p>
                  <p className="truncate font-sans text-[12px]" style={{ color: "rgba(13,11,8,0.5)" }}>
                    {p.label?.trim() || (p.kind === "acompte" ? "Acompte" : p.kind === "solde" ? "Solde" : "Paiement")}
                    {p.quotes?.event_date ? ` · événement le ${fmtDate(p.quotes.event_date)}` : ""}
                  </p>
                </div>
                <span className="shrink-0 whitespace-nowrap font-sans text-[13.5px] font-semibold" style={{ color: "var(--noir)" }}>
                  {chf(Number(p.amount))}
                </span>
              </Link>
            ))
          )}
        </section>

        <section className="rounded-2xl bg-white p-4 md:p-5" style={{ border: "1px solid rgba(13,11,8,0.08)" }}>
          <h2 className="mb-3 font-sans text-[13.5px] font-semibold" style={{ color: "var(--noir)" }}>Prochains événements</h2>
          {collect.events.length === 0 ? (
            <p className="font-sans text-[13px]" style={{ color: "rgba(13,11,8,0.45)" }}>Aucun événement confirmé à venir.</p>
          ) : (
            collect.events.map((e, i) => (
              <Link
                key={e.id}
                href={`/admin/devis/${e.id}`}
                className="flex items-center justify-between gap-3 py-2.5"
                style={{ borderTop: i > 0 ? "1px solid rgba(13,11,8,0.06)" : undefined }}
              >
                <div className="min-w-0">
                  <p className="truncate font-sans text-[13.5px] font-medium" style={{ color: "var(--noir)" }}>
                    {e.clients?.full_name ?? "—"}
                  </p>
                  <p className="truncate font-sans text-[12px]" style={{ color: "rgba(13,11,8,0.5)" }}>{e.title || "Événement"}</p>
                </div>
                <span className="shrink-0 rounded-lg px-2.5 py-1 font-sans text-[12px] font-semibold" style={{ background: "var(--blush)", color: "var(--rose-deep)" }}>
                  {fmtDate(e.event_date)}
                </span>
              </Link>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
