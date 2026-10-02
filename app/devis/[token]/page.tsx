import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import SignaturePadClient from "./signature-pad-client";

function chf(n: number) {
  return "CHF " + n.toLocaleString("fr-CH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-CH", { day: "numeric", month: "long", year: "numeric" });
}

function BalloonIcon() {
  return (
    <svg width="18" height="30" viewBox="0 0 18 30" fill="none" aria-hidden>
      <defs>
        <linearGradient id="ballonGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F2879E" />
          <stop offset="100%" stopColor="#C24B72" />
        </linearGradient>
      </defs>
      <ellipse cx="9" cy="9" rx="7.8" ry="8.6" fill="url(#ballonGold)" />
      <ellipse cx="5.8" cy="5.5" rx="2" ry="2.8" fill="white" opacity="0.28" transform="rotate(-18 5.8 5.5)" />
      <path d="M7.4 17.6 Q9 20.2 10.6 17.6" stroke="url(#ballonGold)" strokeWidth="1.1" fill="url(#ballonGold)" strokeLinecap="round" />
      <path d="M9 20.5 Q7.5 24 9 27.5 Q10 29.5 9 30" stroke="#C24B72" strokeWidth="0.65" strokeLinecap="round" fill="none" opacity="0.5" />
    </svg>
  );
}

export default async function PublicDevisPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = createAdminClient();

  const [{ data: quote }, { data: settings }] = await Promise.all([
    supabase
      .from("quotes")
      .select(
        "reference, title, event_type, event_date, venue, tax_rate, items, status, signed_by, signed_at, signature_data, created_at, deposit_percent, deposit_amount, balance_due_terms, payment_methods, clients(full_name, email, phone, address)",
      )
      .eq("public_token", token)
      .single(),
    supabase.from("settings").select("creditor_name, iban, twint_phone").eq("id", true).single(),
  ]);

  if (!quote) notFound();

  const client = quote.clients as unknown as { full_name: string; email: string | null; phone: string | null; address: string | null } | null;
  const items = (quote.items as { description: string; quantity: number; unit: string; unit_price: number }[]) ?? [];
  const subtotal = items.reduce((s, it) => s + it.quantity * it.unit_price, 0);
  const tax = subtotal * (quote.tax_rate / 100);
  const total = subtotal + tax;
  const isSigned = quote.status === "accepte" && quote.signed_at;

  const depositPercent = quote.deposit_percent;
  const hasFixedDeposit = !!quote.deposit_amount && quote.deposit_amount > 0;
  const hasPercentDeposit = !hasFixedDeposit && !!depositPercent && depositPercent > 0;
  const hasDeposit = hasFixedDeposit || hasPercentDeposit;
  const depositAmount = hasFixedDeposit
    ? (quote.deposit_amount as number)
    : hasPercentDeposit
      ? total * ((depositPercent as number) / 100)
      : 0;
  const balanceAmount = total - depositAmount;
  const paymentMethods = quote.payment_methods ?? [];
  const showPaymentBlock = hasDeposit || !!quote.balance_due_terms || paymentMethods.length > 0;
  const PAYMENT_METHOD_LABELS: Record<string, string> = {
    iban: "Virement bancaire",
    twint: "Twint",
    carte: "Carte bancaire sur place",
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <div className="mb-8 rounded-2xl p-7" style={{ background: "var(--blush)" }}>
        <div className="flex items-center gap-2">
          <BalloonIcon />
          <div className="flex items-baseline gap-1.5">
            <span className="font-sans text-[15px] font-medium uppercase tracking-[0.14em]" style={{ color: "var(--noir)" }}>Event</span>
            <span className="font-serif italic text-[20px]" style={{ color: "#F4A8B8" }}>Fiesta</span>
          </div>
        </div>
        <p className="mt-1 font-sans text-[9.5px] uppercase tracking-[0.2em]" style={{ color: "rgba(13,11,8,0.45)" }}>
          Décoration sur mesure · Lausanne
        </p>
        <p className="mt-5 font-display text-[24px]" style={{ color: "var(--noir)" }}>Devis {quote.reference}</p>
        <p className="font-sans text-[12.5px]" style={{ color: "rgba(13,11,8,0.5)" }}>{fmtDate(quote.created_at)}</p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="border-l-2 pl-3" style={{ borderColor: "var(--rose-deep)" }}>
          <p className="mb-1 font-sans text-[10px] uppercase tracking-[0.1em]" style={{ color: "rgba(13,11,8,0.4)" }}>Client</p>
          <p className="font-sans text-[13.5px] leading-relaxed" style={{ color: "var(--noir)" }}>{client?.full_name}</p>
        </div>
        <div className="border-l-2 pl-3" style={{ borderColor: "var(--rose-deep)" }}>
          <p className="mb-1 font-sans text-[10px] uppercase tracking-[0.1em]" style={{ color: "rgba(13,11,8,0.4)" }}>Événement</p>
          <p className="font-sans text-[13.5px] leading-relaxed" style={{ color: "var(--noir)" }}>
            {quote.title || quote.event_type || "—"}
            {quote.event_date && <><br />Le {fmtDate(quote.event_date)}</>}
            {quote.venue && <><br />{quote.venue}</>}
          </p>
        </div>
      </div>

      <div className="mb-6 overflow-hidden rounded-2xl bg-white" style={{ border: "1px solid rgba(13,11,8,0.1)" }}>
        <div className="flex items-center justify-between px-4 py-2.5" style={{ background: "var(--creme-2)" }}>
          <p className="font-sans text-[10px] uppercase tracking-[0.08em]" style={{ color: "rgba(13,11,8,0.45)" }}>Prestation</p>
          <p className="font-sans text-[10px] uppercase tracking-[0.08em]" style={{ color: "rgba(13,11,8,0.45)" }}>Total</p>
        </div>
        {items.map((item, i) => (
          <div key={i} className="flex items-start justify-between gap-3 px-4 py-3" style={{ borderTop: i > 0 ? "1px solid rgba(13,11,8,0.06)" : undefined }}>
            <div className="min-w-0">
              <p className="font-sans text-[13px]" style={{ color: "var(--noir)" }}>{item.description}</p>
              <p className="font-sans text-[11.5px]" style={{ color: "rgba(13,11,8,0.45)" }}>{item.quantity} {item.unit} × {chf(item.unit_price)}</p>
            </div>
            <p className="shrink-0 whitespace-nowrap font-sans text-[13px] font-semibold" style={{ color: "var(--noir)" }}>
              {chf(item.quantity * item.unit_price)}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-8 ml-auto w-56 rounded-xl p-4" style={{ background: "var(--creme-2)" }}>
        <div className="flex justify-between font-sans text-[13px]" style={{ color: "rgba(13,11,8,0.6)" }}>
          <span>Sous-total</span><span>{chf(subtotal)}</span>
        </div>
        <div className="mt-1 flex justify-between font-sans text-[13px]" style={{ color: "rgba(13,11,8,0.6)" }}>
          <span>TVA ({quote.tax_rate}%)</span><span>{chf(tax)}</span>
        </div>
        <div className="mt-2 flex justify-between border-t pt-2 font-display text-[16px]" style={{ borderColor: "rgba(13,11,8,0.15)", color: "var(--noir)" }}>
          <span>Total</span><span style={{ color: "var(--rose-deep)" }}>{chf(total)}</span>
        </div>
      </div>

      {showPaymentBlock && (
        <div className="mb-8 rounded-2xl p-5" style={{ background: "var(--creme-2)" }}>
          <p className="mb-3 font-sans text-[10px] uppercase tracking-[0.1em]" style={{ color: "rgba(13,11,8,0.45)" }}>
            Conditions de paiement
          </p>

          {hasDeposit ? (
            <>
              <div className="flex justify-between font-sans text-[13px]" style={{ color: "rgba(13,11,8,0.6)" }}>
                <span>Acompte à la commande{hasPercentDeposit ? ` (${depositPercent}%)` : ""}</span>
                <span className="font-semibold" style={{ color: "var(--noir)" }}>{chf(depositAmount)}</span>
              </div>
              <div className="mt-1 flex justify-between font-sans text-[13px]" style={{ color: "rgba(13,11,8,0.6)" }}>
                <span>Solde{quote.balance_due_terms ? ` — ${quote.balance_due_terms}` : ""}</span>
                <span className="font-semibold" style={{ color: "var(--noir)" }}>{chf(balanceAmount)}</span>
              </div>
            </>
          ) : quote.balance_due_terms ? (
            <div className="flex justify-between font-sans text-[13px]" style={{ color: "rgba(13,11,8,0.6)" }}>
              <span>Paiement — {quote.balance_due_terms}</span>
              <span className="font-semibold" style={{ color: "var(--noir)" }}>{chf(total)}</span>
            </div>
          ) : null}

          {paymentMethods.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-4 border-t pt-3" style={{ borderColor: "rgba(13,11,8,0.08)" }}>
              {paymentMethods.includes("iban") && (
                <p className="font-sans text-[12px]" style={{ color: "rgba(13,11,8,0.55)" }}>
                  <span className="font-semibold" style={{ color: "var(--noir)" }}>{PAYMENT_METHOD_LABELS.iban} : </span>
                  {settings?.iban ? (
                    <>
                      {settings.creditor_name ? `${settings.creditor_name} — ` : ""}
                      {settings.iban}
                    </>
                  ) : (
                    <>
                      coordonnées sur{" "}
                      <a href="https://wa.me/41779143855" target="_blank" rel="noreferrer" className="underline" style={{ color: "var(--rose-deep)" }}>
                        WhatsApp
                      </a>
                    </>
                  )}
                </p>
              )}
              {paymentMethods.includes("twint") && (
                <p className="font-sans text-[12px]" style={{ color: "rgba(13,11,8,0.55)" }}>
                  <span className="font-semibold" style={{ color: "var(--noir)" }}>{PAYMENT_METHOD_LABELS.twint} : </span>
                  {settings?.twint_phone || (
                    <a href="https://wa.me/41779143855" target="_blank" rel="noreferrer" className="underline" style={{ color: "var(--rose-deep)" }}>
                      demander le numéro sur WhatsApp
                    </a>
                  )}
                </p>
              )}
              {paymentMethods.includes("carte") && (
                <p className="font-sans text-[12px]" style={{ color: "rgba(13,11,8,0.55)" }}>
                  <span className="font-semibold" style={{ color: "var(--noir)" }}>{PAYMENT_METHOD_LABELS.carte}</span>
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {isSigned ? (
        <div className="rounded-2xl p-6" style={{ background: "var(--blush)" }}>
          <p className="font-display text-[19px]" style={{ color: "var(--noir)" }}>✓ Devis accepté</p>
          <p className="mt-1 font-sans text-[13px]" style={{ color: "rgba(13,11,8,0.6)" }}>
            Signé par {quote.signed_by} le {fmtDate(quote.signed_at)}
          </p>
          {quote.signature_data && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={quote.signature_data} alt="Signature" className="mt-3 h-20 rounded-lg bg-white p-2" />
          )}
        </div>
      ) : (
        <SignaturePadClient token={token} />
      )}
    </div>
  );
}
