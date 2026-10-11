import { PAY_I18N, paymentLabel, paymentDue, twintReference, type PayLang } from "@/lib/payments-i18n";
import { remainingAmount, type QuotePayment } from "@/lib/quote-payments";
import CopyButton from "./copy-button";

function chf(n: number) {
  const [intPart, decPart] = n.toFixed(2).split(".");
  return `CHF ${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'")},${decPart}`;
}

function fmtDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Zurich" });
}

type Step = { done: boolean; current: boolean; title: string; detail?: string; children?: React.ReactNode };

export default function PaymentTracker({
  lang,
  locale,
  reference,
  signedAt,
  eventDate,
  payments,
  balanceTerms,
  twintPhone,
  showTransfer,
  iban,
  creditorName,
}: {
  lang: PayLang;
  locale: string;
  reference: string;
  signedAt: string;
  eventDate: string | null;
  payments: QuotePayment[];
  balanceTerms: string | null;
  twintPhone: string | null;
  showTransfer: boolean;
  iban: string | null;
  creditorName: string | null;
}) {
  const t = PAY_I18N[lang];
  const firstUnpaid = payments.find((p) => p.status !== "paye");
  const remaining = remainingAmount(payments);

  const steps: Step[] = [
    { done: true, current: false, title: t.stepAccepted, detail: fmtDate(signedAt, locale) },
    ...payments.map((p): Step => {
      const label = paymentLabel(p, t);
      const isCurrent = p.id === firstUnpaid?.id;
      const ref = twintReference(reference, label);
      return {
        done: p.status === "paye",
        current: isCurrent,
        title: `${label} · ${chf(Number(p.amount))}`,
        detail: p.status === "paye" && p.paid_at ? t.paidOn(fmtDate(p.paid_at, locale)) : paymentDue(p, t, balanceTerms),
        children:
          isCurrent && twintPhone ? (
            <div className="mt-3 rounded-xl bg-white p-3.5" style={{ border: "1px solid rgba(13,11,8,0.08)" }}>
              <p className="mb-2 font-sans text-[12.5px] font-semibold" style={{ color: "var(--rose-deep)" }}>
                {t.payTwint}
              </p>
              <p className="mb-3 font-sans text-[12.5px] leading-relaxed" style={{ color: "rgba(13,11,8,0.65)" }}>
                {t.twintHint(chf(Number(p.amount)), ref)}
              </p>
              <div className="mb-2 flex items-center justify-between gap-2 rounded-lg px-3 py-2" style={{ background: "var(--creme-2)" }}>
                <span className="font-sans text-[15px] font-semibold tracking-wide" style={{ color: "var(--noir)" }}>
                  {twintPhone}
                </span>
                <CopyButton value={twintPhone.replace(/\s/g, "")} label={t.copy} copiedLabel={t.copied} />
              </div>
              <div className="flex items-center justify-between gap-2 rounded-lg px-3 py-2" style={{ background: "var(--creme-2)" }}>
                <span className="min-w-0 truncate font-sans text-[13px]" style={{ color: "var(--noir)" }}>
                  {ref}
                </span>
                <CopyButton value={ref} label={t.copy} copiedLabel={t.copied} />
              </div>
              {showTransfer && iban && (
                <p className="mt-3 font-sans text-[11.5px]" style={{ color: "rgba(13,11,8,0.5)" }}>
                  {t.orTransfer} : {creditorName ? `${creditorName} — ` : ""}
                  {iban}
                </p>
              )}
            </div>
          ) : undefined,
      };
    }),
    ...(eventDate ? [{ done: false, current: false, title: t.eventDay, detail: fmtDate(eventDate, locale) }] : []),
  ];

  return (
    <div className="mt-6 rounded-2xl bg-white p-5 md:p-6" style={{ border: "1px solid rgba(13,11,8,0.08)" }}>
      <p className="font-display text-[19px]" style={{ color: "var(--noir)" }}>{t.trackTitle}</p>
      <p className="mb-5 font-sans text-[12.5px]" style={{ color: "rgba(13,11,8,0.5)" }}>{t.trackSubtitle}</p>

      <ol className="relative">
        {steps.map((s, i) => (
          <li key={i} className="relative flex gap-3 pb-5 last:pb-0">
            {i < steps.length - 1 && (
              <span
                className="absolute left-[11px] top-6 h-[calc(100%-1.25rem)] w-px"
                style={{ background: s.done ? "#4C9A6A" : "rgba(13,11,8,0.12)" }}
                aria-hidden="true"
              />
            )}
            <span
              className="relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-sans text-[12px] font-bold"
              style={
                s.done
                  ? { background: "#4C9A6A", color: "#fff" }
                  : s.current
                    ? { background: "var(--rose-deep)", color: "#fff" }
                    : { background: "#fff", border: "1.5px solid rgba(13,11,8,0.2)", color: "rgba(13,11,8,0.35)" }
              }
            >
              {s.done ? "✓" : i}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-sans text-[14px] font-semibold" style={{ color: s.done || s.current ? "var(--noir)" : "rgba(13,11,8,0.55)" }}>
                {s.title}
              </p>
              {s.detail && (
                <p className="font-sans text-[12.5px]" style={{ color: s.current ? "var(--rose-deep)" : "rgba(13,11,8,0.5)" }}>
                  {s.detail}
                </p>
              )}
              {s.children}
            </div>
          </li>
        ))}
      </ol>

      {payments.length > 0 && (
        <p
          className="mt-5 rounded-xl px-4 py-3 text-center font-sans text-[13px] font-semibold"
          style={remaining <= 0 ? { background: "rgba(76,154,106,0.12)", color: "#3B7D55" } : { background: "var(--blush)", color: "var(--rose-deep)" }}
        >
          {remaining <= 0 ? t.allPaid : t.remaining(chf(remaining))}
        </p>
      )}
    </div>
  );
}
