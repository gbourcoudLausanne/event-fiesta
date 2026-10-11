import Link from "next/link";
import { CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

type EventRow = {
  id: string;
  title: string | null;
  event_date: string;
  venue: string | null;
  status: string;
  clients: { full_name: string } | null;
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

// Devis accepté = événement confirmé (plein) ; brouillon / envoyé = en attente (contour).
function isConfirmed(e: EventRow) {
  return e.status === "accepte";
}

export default async function AgendaPage({ searchParams }: { searchParams: Promise<{ m?: string }> }) {
  const { m } = await searchParams;
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Zurich" }); // AAAA-MM-JJ
  const [ty, tm] = today.split("-").map(Number);
  const match = m?.match(/^(\d{4})-(\d{2})$/);
  const year = match ? Number(match[1]) : ty;
  const month = match ? Number(match[2]) - 1 : tm - 1;

  const first = `${year}-${pad(month + 1)}-01`;
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const last = `${year}-${pad(month + 1)}-${pad(daysInMonth)}`;

  const supabase = await createClient();
  const { data } = await supabase
    .from("quotes")
    .select("id, title, event_date, venue, status, clients(full_name)")
    .neq("status", "refuse")
    .gte("event_date", first)
    .lte("event_date", last)
    .order("event_date");
  const events = (data ?? []) as unknown as EventRow[];

  const byDay = new Map<string, EventRow[]>();
  for (const e of events) byDay.set(e.event_date, [...(byDay.get(e.event_date) ?? []), e]);

  // Grille du lundi au dimanche
  const firstWeekday = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
  const cells: (string | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => `${year}-${pad(month + 1)}-${pad(i + 1)}`),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const monthLabel = new Date(Date.UTC(year, month, 1)).toLocaleDateString("fr-CH", { month: "long", year: "numeric", timeZone: "UTC" });
  const navBtn = "flex h-10 w-10 items-center justify-center rounded-xl bg-white transition-colors hover:bg-black/5";

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3 md:mb-6">
        <h1 className="font-display text-[23px] md:text-[26px]" style={{ color: "var(--noir)" }}>
          Agenda
        </h1>
        {monthKey(year, month) !== monthKey(ty, tm - 1) && (
          <Link href="/admin/agenda" className="rounded-xl px-3.5 py-2 font-sans text-[12.5px] font-medium" style={{ border: "1px solid rgba(13,11,8,0.14)", color: "var(--noir)" }}>
            Aujourd&apos;hui
          </Link>
        )}
      </div>

      <div className="rounded-2xl bg-white p-3 md:p-5" style={{ border: "1px solid rgba(13,11,8,0.08)" }}>
        <div className="mb-3 flex items-center justify-between">
          <Link href={`/admin/agenda?m=${shiftMonth(year, month, -1)}`} className={navBtn} style={{ border: "1px solid rgba(13,11,8,0.1)" }} aria-label="Mois précédent">
            <CaretLeft size={16} />
          </Link>
          <p className="font-display text-[19px] capitalize" style={{ color: "var(--noir)" }}>{monthLabel}</p>
          <Link href={`/admin/agenda?m=${shiftMonth(year, month, 1)}`} className={navBtn} style={{ border: "1px solid rgba(13,11,8,0.1)" }} aria-label="Mois suivant">
            <CaretRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {WEEKDAYS.map((d) => (
            <p key={d} className="pb-1 text-center font-sans text-[10.5px] uppercase tracking-[0.08em]" style={{ color: "rgba(13,11,8,0.4)" }}>
              {d}
            </p>
          ))}
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;
            const dayEvents = byDay.get(day) ?? [];
            const isToday = day === today;
            return (
              <div
                key={i}
                className="flex min-h-[52px] flex-col rounded-lg p-1 md:min-h-[92px] md:p-1.5"
                style={{
                  background: dayEvents.length ? "var(--creme-2)" : "transparent",
                  outline: isToday ? "1.5px solid var(--rose-deep)" : undefined,
                }}
              >
                <span className="font-sans text-[12px] font-semibold" style={{ color: isToday ? "var(--rose-deep)" : "rgba(13,11,8,0.7)" }}>
                  {Number(day.slice(8))}
                </span>
                {/* Mobile : pastilles */}
                <div className="mt-auto flex flex-wrap gap-0.5 md:hidden">
                  {dayEvents.map((e) => (
                    <span
                      key={e.id}
                      className="h-2 w-2 rounded-full"
                      style={isConfirmed(e) ? { background: "var(--rose-deep)" } : { border: "1.5px solid rgba(13,11,8,0.4)" }}
                    />
                  ))}
                </div>
                {/* Ordinateur : noms des clients */}
                <div className="mt-1 hidden flex-col gap-0.5 md:flex">
                  {dayEvents.map((e) => (
                    <Link
                      key={e.id}
                      href={`/admin/devis/${e.id}`}
                      className="truncate rounded px-1.5 py-0.5 font-sans text-[11px] font-medium"
                      style={
                        isConfirmed(e)
                          ? { background: "var(--rose-deep)", color: "var(--creme)" }
                          : { border: "1px dashed rgba(13,11,8,0.3)", color: "rgba(13,11,8,0.65)" }
                      }
                    >
                      {e.clients?.full_name ?? e.title ?? "Événement"}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap gap-4 font-sans text-[11.5px]" style={{ color: "rgba(13,11,8,0.55)" }}>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--rose-deep)" }} /> Confirmé (devis accepté)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ border: "1.5px solid rgba(13,11,8,0.4)" }} /> En attente (devis pas encore signé)
          </span>
        </div>
      </div>

      <h2 className="mb-3 mt-6 font-sans text-[13.5px] font-semibold capitalize" style={{ color: "var(--noir)" }}>
        {monthLabel} · {events.length} événement{events.length > 1 ? "s" : ""}
      </h2>
      <div className="rounded-2xl bg-white" style={{ border: "1px solid rgba(13,11,8,0.08)" }}>
        {events.length === 0 ? (
          <p className="px-5 py-8 text-center font-sans text-[13.5px]" style={{ color: "rgba(13,11,8,0.4)" }}>
            Aucun événement ce mois-ci.
          </p>
        ) : (
          events.map((e, i) => (
            <Link
              key={e.id}
              href={`/admin/devis/${e.id}`}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-black/[0.02] md:px-5"
              style={{ borderTop: i > 0 ? "1px solid rgba(13,11,8,0.06)" : undefined }}
            >
              <div
                className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl"
                style={isConfirmed(e) ? { background: "var(--rose-deep)", color: "var(--creme)" } : { border: "1.5px dashed rgba(13,11,8,0.25)", color: "rgba(13,11,8,0.6)" }}
              >
                <span className="font-display text-[18px] leading-none">{Number(e.event_date.slice(8))}</span>
                <span className="font-sans text-[9.5px] uppercase">
                  {new Date(`${e.event_date}T12:00:00Z`).toLocaleDateString("fr-CH", { weekday: "short", timeZone: "UTC" })}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-sans text-[14px] font-semibold" style={{ color: "var(--noir)" }}>
                  {e.clients?.full_name ?? "—"}
                </p>
                <p className="truncate font-sans text-[12.5px]" style={{ color: "rgba(13,11,8,0.5)" }}>
                  {[e.title, e.venue].filter(Boolean).join(" · ") || "—"}
                </p>
              </div>
              <span
                className="shrink-0 rounded-full px-2.5 py-1 font-sans text-[11px] font-semibold"
                style={isConfirmed(e) ? { background: "var(--blush)", color: "var(--rose-deep)" } : { background: "var(--creme-2)", color: "rgba(13,11,8,0.55)" }}
              >
                {isConfirmed(e) ? "Confirmé" : "En attente"}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
