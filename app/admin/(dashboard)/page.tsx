import Link from "next/link";
import {
  Plus,
  UserPlus,
  CalendarBlank,
  ArrowRight,
  MapPin,
  Sparkle,
  PaperPlaneTilt,
  Clock,
  Wallet,
  ListChecks,
  HandCoins,
  CheckCircle,
} from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { quoteTotal } from "@/lib/quote-payments";
import { activeSupplements } from "@/lib/quote-supplements";

function chf(n: number) {
  const [intPart, decPart] = n.toFixed(2).split(".");
  return `CHF ${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'")},${decPart}`;
}

// Montant arrondi pour les chiffres clés (CHF 1'250)
function chfShort(n: number) {
  return `CHF ${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'")}`;
}

function zurichDay(iso: string | Date) {
  return new Date(iso).toLocaleDateString("sv-SE", { timeZone: "Europe/Zurich" }); // AAAA-MM-JJ
}

function daysBetween(from: string, to: string) {
  return Math.round((Date.parse(`${to}T12:00:00Z`) - Date.parse(`${from}T12:00:00Z`)) / 86400000);
}

function shortDate(d: string) {
  return new Date(`${d}T12:00:00Z`).toLocaleDateString("fr-CH", { day: "numeric", month: "short", timeZone: "UTC" });
}

type Payment = { id: string; kind: string; label: string | null; amount: number; status: string; paid_at: string | null };
type Quote = {
  id: string;
  reference: string;
  title: string | null;
  status: string;
  event_date: string | null;
  venue: string | null;
  sent_at: string | null;
  signed_at: string | null;
  created_at: string;
  items: unknown;
  tax_rate: number;
  pricing_mode: string | null;
  package_total: number | null;
  deposit_percent: number | null;
  deposit_amount: number | null;
  supplements: unknown;
  client_id: string | null;
  clients: { full_name: string } | null;
  quote_payments: Payment[];
};

type Todo = {
  key: string;
  priority: number;
  tone: "urgent" | "action" | "info";
  icon: "new" | "send" | "relaunch" | "schedule" | "deposit" | "balance" | "supp";
  title: string;
  detail: string;
  href: string;
  cta: string;
};

const ICONS = {
  new: Sparkle,
  send: PaperPlaneTilt,
  relaunch: Clock,
  schedule: ListChecks,
  deposit: HandCoins,
  balance: Wallet,
  supp: CheckCircle,
};

const TONE = {
  urgent: { dot: "#B0546F", bg: "rgba(176,84,111,0.1)", fg: "#B0546F" },
  action: { dot: "var(--rose-deep)", bg: "var(--blush)", fg: "var(--rose-deep)" },
  info: { dot: "rgba(13,11,8,0.35)", bg: "var(--creme-2)", fg: "rgba(13,11,8,0.6)" },
};

async function getData() {
  const supabase = await createClient();
  const [{ data: quoteRows }, { data: webClients }] = await Promise.all([
    supabase
      .from("quotes")
      .select(
        "id, reference, title, status, event_date, venue, sent_at, signed_at, created_at, items, tax_rate, pricing_mode, package_total, deposit_percent, deposit_amount, supplements, client_id, clients(full_name), quote_payments(id, kind, label, amount, status, paid_at)",
      ),
    supabase.from("clients").select("id, full_name, created_at").eq("source", "site_web"),
  ]);
  return {
    quotes: (quoteRows ?? []) as unknown as Quote[],
    webClients: (webClients ?? []) as { id: string; full_name: string; created_at: string }[],
  };
}

export default async function AdminOverviewPage() {
  const { quotes, webClients } = await getData();
  const today = zurichDay(new Date());
  const thisMonth = today.slice(0, 7);
  const prevMonthDate = new Date(Date.UTC(Number(today.slice(0, 4)), Number(today.slice(5, 7)) - 2, 15));
  const prevMonth = prevMonthDate.toISOString().slice(0, 7);

  const allPayments = quotes.flatMap((q) => (q.quote_payments ?? []).map((p) => ({ ...p, quote: q })));
  const paid = allPayments.filter((p) => p.status === "paye" && p.paid_at);
  const unpaid = allPayments.filter((p) => p.status !== "paye" && Number(p.amount) > 0);

  const paidIn = (month: string) => paid.filter((p) => zurichDay(p.paid_at as string).startsWith(month)).reduce((s, p) => s + Number(p.amount), 0);
  const paidThisMonth = paidIn(thisMonth);
  const paidPrevMonth = paidIn(prevMonth);
  const toCollect = unpaid.reduce((s, p) => s + Number(p.amount), 0);

  const waitingSignature = quotes.filter((q) => q.status === "envoye" && !q.signed_at);
  const waitingAmount = waitingSignature.reduce((s, q) => s + quoteTotal(q), 0);

  const upcoming = quotes
    .filter((q) => q.status === "accepte" && q.event_date && q.event_date >= today)
    .sort((a, b) => (a.event_date as string).localeCompare(b.event_date as string));
  const confirmedUpcoming = upcoming.reduce((s, q) => s + quoteTotal(q), 0);
  const next = upcoming.at(0) ?? null;

  // ─── À faire, calculé ──────────────────────────────────────────────
  const quotedClients = new Set(quotes.map((q) => q.client_id));
  const todos: Todo[] = [];

  for (const c of webClients.filter((c) => !quotedClients.has(c.id))) {
    todos.push({
      key: `new-${c.id}`,
      priority: 1,
      tone: "action",
      icon: "new",
      title: `Nouvelle demande · ${c.full_name}`,
      detail: `Reçue le ${shortDate(zurichDay(c.created_at))} via le site`,
      href: `/admin/devis/nouveau?client=${c.id}`,
      cta: "Faire le devis",
    });
  }

  for (const q of quotes) {
    const name = q.clients?.full_name ?? "Client";
    const payments = q.quote_payments ?? [];
    const eventPast = q.event_date && q.event_date < today;

    if (q.status === "brouillon" && !eventPast) {
      todos.push({
        key: `draft-${q.id}`,
        priority: 3,
        tone: "info",
        icon: "send",
        title: `Devis à envoyer · ${name}`,
        detail: `${q.reference}${q.event_date ? ` · événement le ${shortDate(q.event_date)}` : ""}`,
        href: `/admin/devis/${q.id}`,
        cta: "Envoyer",
      });
    }

    if (q.status === "envoye" && !q.signed_at && q.sent_at && !eventPast) {
      const days = daysBetween(zurichDay(q.sent_at), today);
      if (days >= 5) {
        todos.push({
          key: `relaunch-${q.id}`,
          priority: 2,
          tone: "action",
          icon: "relaunch",
          title: `Sans réponse depuis ${days} jours · ${name}`,
          detail: `${q.reference} · ${chf(quoteTotal(q))}`,
          href: `/admin/devis/${q.id}`,
          cta: "Relancer",
        });
      }
    }

    if (q.signed_at && payments.length === 0 && !eventPast) {
      todos.push({
        key: `schedule-${q.id}`,
        priority: 2,
        tone: "action",
        icon: "schedule",
        title: `Échéancier à créer · ${name}`,
        detail: `Devis signé ${q.reference}`,
        href: `/admin/devis/${q.id}`,
        cta: "Créer",
      });
    }

    for (const p of payments) {
      if (p.status === "paye" || Number(p.amount) <= 0) continue;
      if (p.kind === "acompte" && q.signed_at) {
        const days = daysBetween(zurichDay(q.signed_at), today);
        todos.push({
          key: `dep-${p.id}`,
          priority: days >= 2 ? 0 : 2,
          tone: days >= 2 ? "urgent" : "action",
          icon: "deposit",
          title: `Acompte en attente · ${name}`,
          detail: `${chf(Number(p.amount))} · signé ${days === 0 ? "aujourd'hui" : `il y a ${days} jour${days > 1 ? "s" : ""}`}`,
          href: `/admin/devis/${q.id}`,
          cta: "Voir",
        });
      }
      if (p.kind !== "acompte" && q.event_date && !eventPast) {
        const days = daysBetween(today, q.event_date);
        if (days <= 7) {
          todos.push({
            key: `bal-${p.id}`,
            priority: days <= 2 ? 0 : 1,
            tone: days <= 2 ? "urgent" : "action",
            icon: "balance",
            title: `${p.label?.trim() || "Solde"} à encaisser · ${name}`,
            detail: `${chf(Number(p.amount))} · événement ${days === 0 ? "aujourd'hui" : days === 1 ? "demain" : `dans ${days} jours`}`,
            href: `/admin/devis/${q.id}`,
            cta: "Voir",
          });
        }
      }
    }

    const pendingSupp = activeSupplements(q.supplements).filter((s) => !s.accepted_at);
    if (pendingSupp.length > 0 && !eventPast) {
      todos.push({
        key: `supp-${q.id}`,
        priority: 4,
        tone: "info",
        icon: "supp",
        title: `Ajouts à confirmer par ${name}`,
        detail: `${pendingSupp.length} ajout${pendingSupp.length > 1 ? "s" : ""} en attente de sa confirmation`,
        href: `/admin/devis/${q.id}`,
        cta: "Voir",
      });
    }
  }
  todos.sort((a, b) => a.priority - b.priority);

  // ─── Encaissements des 6 derniers mois ─────────────────────────────
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(Date.UTC(Number(today.slice(0, 4)), Number(today.slice(5, 7)) - 1 - (5 - i), 15));
    const key = d.toISOString().slice(0, 7);
    return {
      key,
      label: d.toLocaleDateString("fr-CH", { month: "short", timeZone: "UTC" }).replace(".", ""),
      value: paidIn(key),
    };
  });
  const maxMonth = Math.max(...months.map((m) => m.value), 1);

  const hour = Number(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", hour12: false, timeZone: "Europe/Zurich" }));
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";
  const todayLabel = new Date().toLocaleDateString("fr-CH", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Zurich" });

  const delta = paidThisMonth - paidPrevMonth;
  const card = { border: "1px solid rgba(13,11,8,0.08)" };

  const nextPayments = next?.quote_payments ?? [];
  const nextRemaining = nextPayments.filter((p) => p.status !== "paye").reduce((s, p) => s + Number(p.amount), 0);
  const nextDays = next?.event_date ? daysBetween(today, next.event_date) : 0;

  return (
    <div className="mx-auto max-w-5xl">
      {/* En-tête */}
      <div className="mb-5 flex flex-col gap-4 md:mb-7 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-sans text-[12px] capitalize tracking-wide" style={{ color: "rgba(13,11,8,0.5)" }}>
            {todayLabel}
          </p>
          <h1 className="font-display text-[28px] leading-tight md:text-[34px]" style={{ color: "var(--noir)" }}>
            {greeting} <span style={{ color: "var(--rose-deep)" }}>✦</span>
          </h1>
          <p className="mt-1 font-sans text-[13.5px]" style={{ color: "rgba(13,11,8,0.6)" }}>
            {todos.length === 0
              ? "Tout est à jour, rien ne t'attend."
              : `${todos.length} chose${todos.length > 1 ? "s" : ""} à regarder aujourd'hui.`}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 md:flex">
          <Link
            href="/admin/devis/nouveau"
            className="flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 font-sans text-[13px] font-medium"
            style={{ background: "var(--rose-deep)", color: "var(--creme)" }}
          >
            <Plus size={14} weight="bold" /> Devis
          </Link>
          <Link
            href="/admin/clients"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2.5 font-sans text-[13px] font-medium"
            style={{ ...card, color: "var(--noir)" }}
          >
            <UserPlus size={15} /> Client
          </Link>
          <Link
            href="/admin/agenda"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2.5 font-sans text-[13px] font-medium"
            style={{ ...card, color: "var(--noir)" }}
          >
            <CalendarBlank size={15} /> Agenda
          </Link>
        </div>
      </div>

      {/* Chiffres clés */}
      <div className="mb-5 grid grid-cols-2 gap-2.5 md:mb-6 md:grid-cols-4 md:gap-4">
        <Link href="/admin/paiements" className="flex flex-col justify-between rounded-2xl p-4 md:p-5" style={{ background: "var(--noir)", color: "var(--creme)" }}>
          <p className="font-sans text-[10.5px] uppercase tracking-[0.12em]" style={{ color: "var(--or-light)" }}>Encaissé ce mois</p>
          <p className="mt-2 font-display text-[24px] leading-none md:text-[30px]">{chfShort(paidThisMonth)}</p>
          <p className="mt-2 font-sans text-[11.5px]" style={{ color: "rgba(250,247,242,0.6)" }}>
            {paidPrevMonth === 0 && paidThisMonth === 0
              ? "Aucun encaissement"
              : `${delta >= 0 ? "+" : "−"} ${chfShort(Math.abs(delta)).replace("CHF ", "")} vs mois dernier`}
          </p>
        </Link>
        <Link href="/admin/paiements" className="flex flex-col justify-between rounded-2xl bg-white p-4 md:p-5" style={card}>
          <p className="font-sans text-[10.5px] uppercase tracking-[0.12em]" style={{ color: "rgba(13,11,8,0.45)" }}>À encaisser</p>
          <p className="mt-2 font-display text-[24px] leading-none md:text-[30px]" style={{ color: toCollect > 0 ? "var(--rose-deep)" : "var(--noir)" }}>
            {chfShort(toCollect)}
          </p>
          <p className="mt-2 font-sans text-[11.5px]" style={{ color: "rgba(13,11,8,0.5)" }}>
            {unpaid.length} paiement{unpaid.length > 1 ? "s" : ""} en attente
          </p>
        </Link>
        <Link href="/admin/devis" className="flex flex-col justify-between rounded-2xl bg-white p-4 md:p-5" style={card}>
          <p className="font-sans text-[10.5px] uppercase tracking-[0.12em]" style={{ color: "rgba(13,11,8,0.45)" }}>À signer</p>
          <p className="mt-2 font-display text-[24px] leading-none md:text-[30px]" style={{ color: "var(--noir)" }}>
            {waitingSignature.length}
            <span className="ml-1.5 font-sans text-[12px]" style={{ color: "rgba(13,11,8,0.45)" }}>devis</span>
          </p>
          <p className="mt-2 font-sans text-[11.5px]" style={{ color: "rgba(13,11,8,0.5)" }}>
            {waitingAmount > 0 ? `${chfShort(waitingAmount)} en jeu` : "Aucun en attente"}
          </p>
        </Link>
        <Link href="/admin/agenda" className="flex flex-col justify-between rounded-2xl bg-white p-4 md:p-5" style={card}>
          <p className="font-sans text-[10.5px] uppercase tracking-[0.12em]" style={{ color: "rgba(13,11,8,0.45)" }}>Confirmé à venir</p>
          <p className="mt-2 font-display text-[24px] leading-none md:text-[30px]" style={{ color: "var(--noir)" }}>
            {chfShort(confirmedUpcoming)}
          </p>
          <p className="mt-2 font-sans text-[11.5px]" style={{ color: "rgba(13,11,8,0.5)" }}>
            {upcoming.length} événement{upcoming.length > 1 ? "s" : ""}
          </p>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.35fr_1fr] lg:gap-5">
        {/* À faire */}
        <section className="rounded-2xl bg-white p-4 md:p-5" style={card}>
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="font-display text-[19px]" style={{ color: "var(--noir)" }}>À faire</h2>
            {todos.length > 0 && (
              <span className="rounded-full px-2.5 py-0.5 font-sans text-[11.5px] font-semibold" style={{ background: "var(--blush)", color: "var(--rose-deep)" }}>
                {todos.length}
              </span>
            )}
          </div>
          {todos.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <span className="mb-2 flex h-11 w-11 items-center justify-center rounded-full" style={{ background: "rgba(76,154,106,0.12)", color: "#3B7D55" }}>
                <CheckCircle size={22} weight="fill" />
              </span>
              <p className="font-sans text-[13.5px] font-semibold" style={{ color: "var(--noir)" }}>Rien à faire pour l&apos;instant</p>
              <p className="font-sans text-[12.5px]" style={{ color: "rgba(13,11,8,0.5)" }}>Les relances et paiements sont suivis automatiquement.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {todos.map((t, i) => {
                const Icon = ICONS[t.icon];
                const tone = TONE[t.tone];
                return (
                  <Link
                    key={t.key}
                    href={t.href}
                    className="group flex items-center gap-3 py-3 transition-colors"
                    style={{ borderTop: i > 0 ? "1px solid rgba(13,11,8,0.06)" : undefined }}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: tone.bg, color: tone.fg }}>
                      <Icon size={17} weight={t.tone === "urgent" ? "fill" : "regular"} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-sans text-[13.5px] font-semibold" style={{ color: "var(--noir)" }}>{t.title}</p>
                      <p className="truncate font-sans text-[12px]" style={{ color: t.tone === "urgent" ? tone.fg : "rgba(13,11,8,0.5)" }}>{t.detail}</p>
                    </div>
                    <span className="hidden shrink-0 items-center gap-1 font-sans text-[12px] font-semibold sm:flex" style={{ color: "var(--rose-deep)" }}>
                      {t.cta} <ArrowRight size={12} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                    <ArrowRight size={14} className="shrink-0 sm:hidden" style={{ color: "rgba(13,11,8,0.3)" }} />
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <div className="flex flex-col gap-4 lg:gap-5">
          {/* Prochain événement */}
          {next && next.event_date ? (
            <Link
              href={`/admin/devis/${next.id}`}
              className="relative overflow-hidden rounded-2xl p-5"
              style={{ background: "linear-gradient(135deg, #F7E3E9 0%, #F5E6E0 100%)", border: "1px solid rgba(176,84,111,0.15)" }}
            >
              <p className="font-sans text-[10.5px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--rose-deep)" }}>
                Prochain événement · {nextDays === 0 ? "aujourd'hui" : nextDays === 1 ? "demain" : `dans ${nextDays} jours`}
              </p>
              <div className="mt-3 flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl" style={{ background: "var(--rose-deep)", color: "var(--creme)" }}>
                  <span className="font-sans text-[10px] font-semibold uppercase">
                    {new Date(`${next.event_date}T12:00:00Z`).toLocaleDateString("fr-CH", { month: "short", timeZone: "UTC" }).replace(".", "")}
                  </span>
                  <span className="font-display text-[28px] leading-none">{Number(next.event_date.slice(8))}</span>
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display text-[20px] leading-tight" style={{ color: "var(--noir)" }}>{next.clients?.full_name ?? "—"}</p>
                  {next.title && <p className="truncate font-sans text-[13px]" style={{ color: "rgba(13,11,8,0.65)" }}>{next.title}</p>}
                  {next.venue && (
                    <p className="flex items-center gap-1 truncate font-sans text-[12px]" style={{ color: "rgba(13,11,8,0.5)" }}>
                      <MapPin size={12} className="shrink-0" /> <span className="truncate">{next.venue}</span>
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-xl bg-white/70 px-3.5 py-2.5">
                <span className="font-sans text-[12.5px]" style={{ color: "rgba(13,11,8,0.6)" }}>
                  {nextPayments.length === 0 ? "Échéancier à créer" : nextRemaining <= 0 ? "Tout est payé" : "Reste à encaisser"}
                </span>
                <span className="font-sans text-[13.5px] font-semibold" style={{ color: nextRemaining > 0 ? "var(--rose-deep)" : "#3B7D55" }}>
                  {nextPayments.length === 0 ? chf(quoteTotal(next)) : nextRemaining <= 0 ? "✓" : chf(nextRemaining)}
                </span>
              </div>
            </Link>
          ) : (
            <div className="rounded-2xl bg-white p-5 text-center" style={card}>
              <p className="font-sans text-[13.5px] font-semibold" style={{ color: "var(--noir)" }}>Aucun événement confirmé à venir</p>
              <p className="font-sans text-[12.5px]" style={{ color: "rgba(13,11,8,0.5)" }}>Ils apparaissent ici dès qu&apos;un devis est signé.</p>
            </div>
          )}

          {/* Encaissements 6 mois */}
          <section className="rounded-2xl bg-white p-4 md:p-5" style={card}>
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="font-sans text-[13.5px] font-semibold" style={{ color: "var(--noir)" }}>Encaissements</h2>
              <span className="font-sans text-[11.5px]" style={{ color: "rgba(13,11,8,0.45)" }}>6 derniers mois</span>
            </div>
            <svg viewBox="0 0 300 132" className="w-full" role="img" aria-label="Encaissements des 6 derniers mois">
              <line x1="0" x2="300" y1="104" y2="104" stroke="rgba(13,11,8,0.12)" strokeWidth="1" />
              {months.map((m, i) => {
                const w = 30;
                const x = 12 + i * 48;
                const h = m.value > 0 ? Math.max(4, (m.value / maxMonth) * 76) : 0;
                const current = m.key === thisMonth;
                return (
                  <g key={m.key}>
                    <title>{`${m.label} : ${chf(m.value)}`}</title>
                    {/* zone de survol plus large que la barre */}
                    <rect x={x - 8} y="0" width={w + 16} height="120" fill="transparent" />
                    {h > 0 && (
                      <path
                        d={`M${x} 104 V${104 - h + 4} Q${x} ${104 - h} ${x + 4} ${104 - h} H${x + w - 4} Q${x + w} ${104 - h} ${x + w} ${104 - h + 4} V104 Z`}
                        fill={current ? "#B0546F" : "rgba(176,84,111,0.28)"}
                      />
                    )}
                    {(current || m.value === maxMonth) && m.value > 0 && (
                      <text x={x + w / 2} y={104 - h - 6} textAnchor="middle" fontSize="10" fontWeight="600" fill="rgba(13,11,8,0.75)" fontFamily="var(--font-montserrat)">
                        {chfShort(m.value).replace("CHF ", "")}
                      </text>
                    )}
                    <text x={x + w / 2} y="122" textAnchor="middle" fontSize="10" fill={current ? "rgba(13,11,8,0.8)" : "rgba(13,11,8,0.45)"} fontWeight={current ? 600 : 400} fontFamily="var(--font-montserrat)">
                      {m.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </section>

          {/* Événements suivants */}
          {upcoming.length > 1 && (
            <section className="rounded-2xl bg-white p-4 md:p-5" style={card}>
              <h2 className="mb-1 font-sans text-[13.5px] font-semibold" style={{ color: "var(--noir)" }}>Ensuite</h2>
              {upcoming.slice(1, 5).map((e, i) => (
                <Link
                  key={e.id}
                  href={`/admin/devis/${e.id}`}
                  className="flex items-center justify-between gap-3 py-2.5"
                  style={{ borderTop: i > 0 ? "1px solid rgba(13,11,8,0.06)" : undefined }}
                >
                  <div className="min-w-0">
                    <p className="truncate font-sans text-[13.5px] font-medium" style={{ color: "var(--noir)" }}>{e.clients?.full_name ?? "—"}</p>
                    <p className="truncate font-sans text-[12px]" style={{ color: "rgba(13,11,8,0.5)" }}>{e.title || "Événement"}</p>
                  </div>
                  <span className="shrink-0 rounded-lg px-2.5 py-1 font-sans text-[12px] font-semibold" style={{ background: "var(--blush)", color: "var(--rose-deep)" }}>
                    {shortDate(e.event_date as string)}
                  </span>
                </Link>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
