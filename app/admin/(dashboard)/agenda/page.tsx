import Link from "next/link";
import { CaretLeft, CaretRight, CalendarBlank, MapPin, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { quoteTotal } from "@/lib/quote-payments";

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

type EventRow = {
  id: string;
  title: string | null;
  event_date: string;
  venue: string | null;
  status: string;
  items: unknown;
  tax_rate: number;
  pricing_mode: string | null;
  package_total: number | null;
  deposit_percent: number | null;
  deposit_amount: number | null;
  clients: { full_name: string } | null;
  quote_payments: { amount: number; status: string }[];
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function monthKey(y: number, m: number) {
  return `${y}-${pad(m + 1)}`;
}

function shiftMonth(y: number, m: number, delta: number) {
  const d = new Date(Date.UTC(y, m + delta, 1));
  return monthKey(d.getUTCFullYear(), d.getUTCMonth());
}

function chf(n: number) {
  const [intPart, decPart] = n.toFixed(2).split(".");
  return `CHF ${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'")},${decPart}`;
}

function daysBetween(from: string, to: string) {
  return Math.round((Date.parse(`${to}T12:00:00Z`) - Date.parse(`${from}T12:00:00Z`)) / 86400000);
}

function countdown(today: string, date: string) {
  const d = daysBetween(today, date);
  if (d === 0) return "Aujourd'hui";
  if (d === 1) return "Demain";
  if (d > 1) return `Dans ${d} jours`;
  return "Passé";
}

// Devis accepté = événement confirmé ; brouillon / envoyé = date en option.
function isConfirmed(e: { status: string }) {
  return e.status === "accepte";
}

function paymentBadge(e: EventRow) {
  if (!isConfirmed(e)) return null;
  const payments = e.quote_payments ?? [];
  if (payments.length === 0) return { text: "Échéancier à créer", tone: "muted" as const };
  const remaining = payments.filter((p) => p.status !== "paye").reduce((s, p) => s + Number(p.amount), 0);
  if (remaining <= 0) return { text: "Tout payé", tone: "ok" as const };
  return { text: `Reste ${chf(remaining)}`, tone: "due" as const };
}

const BADGE_STYLE = {
  ok: { background: "rgba(76,154,106,0.12)", color: "#3B7D55" },
  due: { background: "var(--blush)", color: "var(--rose-deep)" },
  muted: { background: "var(--creme-2)", color: "rgba(13,11,8,0.55)" },
};

export default async function AgendaPage({ searchParams }: { searchParams: Promise<{ m?: string }> }) {
  const { m } = await searchParams;
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Zurich" }); // AAAA-MM-JJ
  const [ty, tm] = today.split("-").map(Number);
  const match = m?.match(/^(\d{4})-(\d{2})$/);
  const year = match ? Number(match[1]) : ty;
  const month = match ? Number(match[2]) - 1 : tm - 1;
  const isCurrentMonth = monthKey(year, month) === monthKey(ty, tm - 1);

  const first = `${year}-${pad(month + 1)}-01`;
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const last = `${year}-${pad(month + 1)}-${pad(daysInMonth)}`;

  const supabase = await createClient();
  const [{ data }, { data: nextRows }] = await Promise.all([
    supabase
      .from("quotes")
      .select(
        "id, title, event_date, venue, status, items, tax_rate, pricing_mode, package_total, deposit_percent, deposit_amount, clients(full_name), quote_payments(amount, status)",
      )
      .neq("status", "refuse")
      .gte("event_date", first)
      .lte("event_date", last)
      .order("event_date"),
    // Pour un mois vide : le prochain événement après ce mois
    supabase
      .from("quotes")
      .select("event_date, clients(full_name)")
      .neq("status", "refuse")
      .gt("event_date", last)
      .order("event_date")
      .limit(1),
  ]);
  const events = (data ?? []) as unknown as EventRow[];
  const nextEvent = (nextRows?.[0] ?? null) as unknown as { event_date: string; clients: { full_name: string } | null } | null;

  const byDay = new Map<string, EventRow[]>();
  for (const e of events) byDay.set(e.event_date, [...(byDay.get(e.event_date) ?? []), e]);

  const confirmed = events.filter(isConfirmed);
  const pendingCount = events.length - confirmed.length;
  const confirmedRevenue = confirmed.reduce((s, e) => s + quoteTotal(e), 0);

  // Grille du lundi au dimanche
  const firstWeekday = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
  const cells: (string | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => `${year}-${pad(month + 1)}-${pad(i + 1)}`),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const monthName = new Date(Date.UTC(year, month, 1)).toLocaleDateString("fr-CH", { month: "long", timeZone: "UTC" });
  const monthTitle = `${monthName.charAt(0).toUpperCase()}${monthName.slice(1)} ${year}`;

  const navBtn = "flex h-10 w-10 items-center justify-center rounded-xl bg-white transition-colors hover:bg-black/[0.04]";
  const border = "1px solid rgba(13,11,8,0.1)";

  return (
    <div>
      {/* En-tête : mois + navigation */}
      <div className="mb-4 flex items-end justify-between gap-3 md:mb-5">
        <div>
          <p className="font-sans text-[11px] uppercase tracking-[0.14em]" style={{ color: "var(--rose-deep)" }}>
            Agenda
          </p>
          <h1 className="font-display text-[26px] leading-tight md:text-[30px]" style={{ color: "var(--noir)" }}>
            {monthTitle}
          </h1>
        </div>
        <div className="flex items-center gap-1.5">
          <Link href={`/admin/agenda?m=${shiftMonth(year, month, -1)}`} className={navBtn} style={{ border }} aria-label="Mois précédent">
            <CaretLeft size={16} weight="bold" />
          </Link>
          {!isCurrentMonth && (
            <Link
              href="/admin/agenda"
              className="hidden h-10 items-center rounded-xl bg-white px-3.5 font-sans text-[12.5px] font-medium sm:flex"
              style={{ border, color: "var(--noir)" }}
            >
              Aujourd&apos;hui
            </Link>
          )}
          <Link href={`/admin/agenda?m=${shiftMonth(year, month, 1)}`} className={navBtn} style={{ border }} aria-label="Mois suivant">
            <CaretRight size={16} weight="bold" />
          </Link>
        </div>
      </div>

      {/* Résumé du mois */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="rounded-full px-3 py-1.5 font-sans text-[12px] font-semibold" style={{ background: "var(--rose-deep)", color: "var(--creme)" }}>
          {confirmed.length} confirmé{confirmed.length > 1 ? "s" : ""}
        </span>
        {pendingCount > 0 && (
          <span className="rounded-full px-3 py-1.5 font-sans text-[12px] font-semibold" style={{ border: "1px dashed rgba(13,11,8,0.3)", color: "rgba(13,11,8,0.65)" }}>
            {pendingCount} en attente
          </span>
        )}
        {confirmedRevenue > 0 && (
          <span className="rounded-full bg-white px-3 py-1.5 font-sans text-[12px] font-semibold" style={{ border, color: "var(--noir)" }}>
            {chf(confirmedRevenue)} confirmés
          </span>
        )}
        {!isCurrentMonth && (
          <Link href="/admin/agenda" className="rounded-full bg-white px-3 py-1.5 font-sans text-[12px] font-medium sm:hidden" style={{ border, color: "var(--noir)" }}>
            Aujourd&apos;hui
          </Link>
        )}
      </div>

      {/* Calendrier */}
      <div className="overflow-hidden rounded-2xl bg-white" style={{ border: "1px solid rgba(13,11,8,0.08)" }}>
        <div className="grid grid-cols-7" style={{ background: "var(--creme-2)" }}>
          {WEEKDAYS.map((d, i) => (
            <p
              key={d}
              className="py-2 text-center font-sans text-[10.5px] font-semibold uppercase tracking-[0.1em]"
              style={{ color: i >= 5 ? "var(--rose-deep)" : "rgba(13,11,8,0.45)" }}
            >
              {d}
            </p>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px" style={{ background: "rgba(13,11,8,0.06)" }}>
          {cells.map((day, i) => {
            const weekend = i % 7 >= 5;
            if (!day) return <div key={i} style={{ background: weekend ? "#FCFAF7" : "#fff" }} />;
            const dayEvents = byDay.get(day) ?? [];
            const isToday = day === today;
            const isPast = day < today;
            const hasConfirmed = dayEvents.some(isConfirmed);
            const single = dayEvents.length === 1 ? dayEvents[0] : null;

            const content = (
              <>
                <div className="flex items-center justify-between">
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-full font-sans text-[12px] font-semibold md:h-7 md:w-7 md:text-[13px]"
                    style={
                      isToday
                        ? { background: "var(--noir)", color: "var(--creme)" }
                        : dayEvents.length > 0
                          ? hasConfirmed
                            ? { background: "var(--rose-deep)", color: "var(--creme)" }
                            : { border: "1.5px dashed rgba(13,11,8,0.4)", color: "var(--noir)" }
                          : { color: isPast ? "rgba(13,11,8,0.28)" : "rgba(13,11,8,0.75)" }
                    }
                  >
                    {Number(day.slice(8))}
                  </span>
                  {dayEvents.length > 1 && (
                    <span className="font-sans text-[10px] font-bold md:hidden" style={{ color: "var(--rose-deep)" }}>
                      ×{dayEvents.length}
                    </span>
                  )}
                </div>
                {/* Ordinateur : événements du jour */}
                <div className="mt-1.5 hidden flex-col gap-1 md:flex">
                  {dayEvents.map((e) => (
                    <span
                      key={e.id}
                      className="block truncate rounded-md py-1 pl-2 pr-1.5 font-sans text-[11px] font-semibold leading-tight"
                      style={
                        isConfirmed(e)
                          ? { background: "var(--blush)", color: "var(--rose-deep)", borderLeft: "3px solid var(--rose-deep)" }
                          : { background: "#fff", color: "rgba(13,11,8,0.6)", border: "1px dashed rgba(13,11,8,0.25)" }
                      }
                    >
                      {e.clients?.full_name ?? e.title ?? "Événement"}
                    </span>
                  ))}
                </div>
              </>
            );

            const cellCls = "flex min-h-[54px] flex-col p-1.5 md:min-h-[104px] md:p-2";
            const cellStyle = {
              background: hasConfirmed ? "#FDF6F8" : weekend ? "#FCFAF7" : "#fff",
              opacity: isPast && dayEvents.length === 0 ? 0.85 : 1,
            };

            // Jour avec événement(s) : toute la case est cliquable (devis, ou liste s'il y en a plusieurs)
            return dayEvents.length > 0 ? (
              <Link
                key={i}
                href={single ? `/admin/devis/${single.id}` : `#jour-${day}`}
                className={cellCls + " transition-colors hover:brightness-[0.98]"}
                style={cellStyle}
              >
                {content}
              </Link>
            ) : (
              <div key={i} className={cellCls} style={cellStyle}>
                {content}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-4 py-3 font-sans text-[11.5px]" style={{ color: "rgba(13,11,8,0.55)", borderTop: "1px solid rgba(13,11,8,0.06)" }}>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full" style={{ background: "var(--rose-deep)" }} /> Confirmé
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full" style={{ border: "1.5px dashed rgba(13,11,8,0.4)" }} /> En attente de signature
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full" style={{ background: "var(--noir)" }} /> Aujourd&apos;hui
          </span>
        </div>
      </div>

      {/* Liste du mois */}
      <h2 className="mb-3 mt-7 font-sans text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: "rgba(13,11,8,0.5)" }}>
        Événements de {monthName} · {events.length}
      </h2>

      {events.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl bg-white px-6 py-10 text-center" style={{ border: "1px solid rgba(13,11,8,0.08)" }}>
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "var(--blush)", color: "var(--rose-deep)" }}>
            <CalendarBlank size={22} />
          </span>
          <p className="font-sans text-[14px] font-semibold" style={{ color: "var(--noir)" }}>Aucun événement ce mois-ci</p>
          {nextEvent ? (
            <Link
              href={`/admin/agenda?m=${nextEvent.event_date.slice(0, 7)}`}
              className="mt-3 flex items-center gap-1.5 font-sans text-[13px] font-medium"
              style={{ color: "var(--rose-deep)" }}
            >
              Prochain : {nextEvent.clients?.full_name ?? "événement"} le{" "}
              {new Date(`${nextEvent.event_date}T12:00:00Z`).toLocaleDateString("fr-CH", { day: "numeric", month: "long", timeZone: "UTC" })}
              <ArrowRight size={14} />
            </Link>
          ) : (
            <p className="mt-1 font-sans text-[12.5px]" style={{ color: "rgba(13,11,8,0.45)" }}>Les devis avec une date d&apos;événement apparaissent ici.</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {events.map((e) => {
            const badge = paymentBadge(e);
            const past = e.event_date < today;
            return (
              <Link
                key={e.id}
                id={`jour-${e.event_date}`}
                href={`/admin/devis/${e.id}`}
                className="flex scroll-mt-24 items-stretch gap-3 rounded-2xl bg-white p-3 transition-colors hover:bg-black/[0.015] md:p-4"
                style={{ border: "1px solid rgba(13,11,8,0.08)", opacity: past ? 0.7 : 1 }}
              >
                <div
                  className="flex w-14 shrink-0 flex-col items-center justify-center rounded-xl py-2"
                  style={
                    isConfirmed(e)
                      ? { background: "var(--rose-deep)", color: "var(--creme)" }
                      : { border: "1.5px dashed rgba(13,11,8,0.25)", color: "rgba(13,11,8,0.65)" }
                  }
                >
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-wide opacity-85">
                    {new Date(`${e.event_date}T12:00:00Z`).toLocaleDateString("fr-CH", { weekday: "short", timeZone: "UTC" }).replace(".", "")}
                  </span>
                  <span className="font-display text-[24px] leading-none">{Number(e.event_date.slice(8))}</span>
                </div>

                <div className="min-w-0 flex-1 py-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate font-sans text-[14.5px] font-semibold" style={{ color: "var(--noir)" }}>
                      {e.clients?.full_name ?? "—"}
                    </p>
                    <span className="shrink-0 font-sans text-[11.5px] font-semibold" style={{ color: past ? "rgba(13,11,8,0.4)" : "var(--rose-deep)" }}>
                      {countdown(today, e.event_date)}
                    </span>
                  </div>
                  {e.title && (
                    <p className="truncate font-sans text-[12.5px]" style={{ color: "rgba(13,11,8,0.6)" }}>{e.title}</p>
                  )}
                  {e.venue && (
                    <p className="flex items-center gap-1 truncate font-sans text-[12px]" style={{ color: "rgba(13,11,8,0.45)" }}>
                      <MapPin size={12} className="shrink-0" /> <span className="truncate">{e.venue}</span>
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-full px-2 py-0.5 font-sans text-[11px] font-semibold" style={isConfirmed(e) ? BADGE_STYLE.due : BADGE_STYLE.muted}>
                      {isConfirmed(e) ? "Confirmé" : "En attente de signature"}
                    </span>
                    {badge && (
                      <span className="rounded-full px-2 py-0.5 font-sans text-[11px] font-semibold" style={BADGE_STYLE[badge.tone]}>
                        {badge.text}
                      </span>
                    )}
                    <span className="ml-auto font-sans text-[12.5px] font-semibold" style={{ color: "var(--noir)" }}>
                      {chf(quoteTotal(e))}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
