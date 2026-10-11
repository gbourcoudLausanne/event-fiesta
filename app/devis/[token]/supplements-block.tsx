"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SUPP_I18N, type PayLang } from "@/lib/payments-i18n";
import type { Supplement } from "@/lib/quote-supplements";
import { acceptSupplements } from "./actions";

function chf(n: number) {
  const [intPart, decPart] = n.toFixed(2).split(".");
  return `CHF ${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'")},${decPart}`;
}

export default function SupplementsBlock({
  token,
  lang,
  locale,
  supplements,
  baseTotal,
}: {
  token: string;
  lang: PayLang;
  locale: string;
  supplements: Supplement[];
  baseTotal: number;
}) {
  const t = SUPP_I18N[lang];
  const router = useRouter();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fmt = (iso: string) => new Date(iso).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Zurich" });

  const extra = supplements.reduce((s, x) => s + Number(x.amount), 0);
  const hasPending = supplements.some((s) => !s.accepted_at);

  return (
    <div className="mt-6 rounded-2xl bg-white p-5 md:p-6" style={{ border: "2px solid var(--rose-deep)" }}>
      <p className="font-display text-[19px]" style={{ color: "var(--noir)" }}>{t.title}</p>
      <p className="mb-4 font-sans text-[12.5px]" style={{ color: "rgba(13,11,8,0.5)" }}>{t.subtitle}</p>

      {supplements.map((s) => (
        <div key={s.id} className="flex items-start justify-between gap-3 py-2.5" style={{ borderTop: "1px solid rgba(13,11,8,0.06)" }}>
          <div className="min-w-0">
            <p className="font-sans text-[14px] font-medium" style={{ color: "var(--noir)" }}>{s.description}</p>
            <p className="font-sans text-[12px]" style={{ color: s.accepted_at ? "#3B7D55" : "var(--rose-deep)" }}>
              {t.addedOn(fmt(s.added_at))} · {s.accepted_at ? t.confirmedOn(fmt(s.accepted_at)) : t.pending}
            </p>
          </div>
          <span className="shrink-0 font-sans text-[14px] font-semibold" style={{ color: "var(--noir)" }}>+ {chf(Number(s.amount))}</span>
        </div>
      ))}

      <div className="mt-1 flex flex-col gap-1 pt-3 font-sans text-[13px]" style={{ borderTop: "1px solid rgba(13,11,8,0.1)" }}>
        <div className="flex justify-between" style={{ color: "rgba(13,11,8,0.55)" }}>
          <span>{t.signedTotal}</span>
          <span>{chf(baseTotal)}</span>
        </div>
        <div className="flex justify-between" style={{ color: "rgba(13,11,8,0.55)" }}>
          <span>{t.extras}</span>
          <span>+ {chf(extra)}</span>
        </div>
        <div className="flex justify-between font-display text-[18px]" style={{ color: "var(--noir)" }}>
          <span>{t.newTotal}</span>
          <span style={{ color: "var(--rose-deep)" }}>{chf(baseTotal + extra)}</span>
        </div>
      </div>

      {error && <p className="mt-3 font-sans text-[12.5px]" style={{ color: "#B0546F" }}>{error}</p>}
      {done ? (
        <p className="mt-4 rounded-xl px-4 py-3 text-center font-sans text-[13.5px] font-semibold" style={{ background: "rgba(76,154,106,0.12)", color: "#3B7D55" }}>
          {t.thanks}
        </p>
      ) : (
        hasPending && (
          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                const res = await acceptSupplements(token);
                if (res.error) setError(res.error);
                else {
                  setDone(true);
                  router.refresh();
                }
              })
            }
            className="mt-4 w-full rounded-2xl px-5 py-3.5 font-sans text-[14px] font-semibold disabled:opacity-60"
            style={{ background: "var(--rose-deep)", color: "var(--creme)" }}
          >
            {isPending ? t.confirming : t.confirmButton}
          </button>
        )
      )}
    </div>
  );
}
