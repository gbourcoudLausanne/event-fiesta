import { createClient } from "@/lib/supabase/server";

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
      className="rounded-2xl bg-white px-6 py-5"
      style={{ border: "1px solid rgba(13,11,8,0.08)" }}
    >
      <p
        className="mb-2 font-sans text-[11px] uppercase tracking-[0.12em]"
        style={{ color: "rgba(13,11,8,0.45)" }}
      >
        {label}
      </p>
      <p className="font-display text-[32px]" style={{ color: "var(--noir)" }}>
        {value}
      </p>
    </div>
  );
}

export default async function AdminOverviewPage() {
  const counts = await getCounts();

  return (
    <div>
      <h1 className="mb-6 font-display text-[26px]" style={{ color: "var(--noir)" }}>
        Vue d&apos;ensemble
      </h1>
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Nouvelles demandes" value={counts.newRequests} />
        <StatCard label="Clients" value={counts.clients} />
        <StatCard label="Devis en attente" value={counts.quotesPending} />
        <StatCard label="Factures impayées" value={counts.invoicesUnpaid} />
      </div>
    </div>
  );
}
