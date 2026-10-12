import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { DEVIS_I18N, type DevisLang, resolveNotes, formatSignedAt } from "@/lib/devis-i18n";
import SignaturePadClient from "./signature-pad-client";
import PaymentTracker from "./payment-tracker";
import SupplementsBlock from "./supplements-block";
import { activeSupplements, supplementsTotal } from "@/lib/quote-supplements";
import { PAYMENT_COLUMNS, type QuotePayment } from "@/lib/quote-payments";

function chf(n: number) {
  const [intPart, decPart] = n.toFixed(2).split(".");
  return `CHF ${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'")},${decPart}`;
}

function fmtDate(d: string | null, locale: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
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

type TranslatedItem = { title?: string | null; description?: string | null; unit?: string | null };
type TranslatedContent = {
  title?: string | null;
  event_type?: string | null;
  venue?: string | null;
  balance_due_terms?: string | null;
  notes_text?: string | null;
  items?: TranslatedItem[];
};

export default async function PublicDevisPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = createAdminClient();

  const [{ data: quote }, { data: settings }] = await Promise.all([
    supabase
      .from("quotes")
      .select(
        "id, reference, title, event_type, event_date, venue, tax_rate, items, status, signed_by, signed_at, signature_data, created_at, deposit_percent, deposit_amount, balance_due_terms, payment_methods, pricing_mode, package_total, reference_images, client_language, translated_content, show_notes, notes_text, supplements, clients(full_name, email, phone, address)",
      )
      .eq("public_token", token)
      .single(),
    supabase.from("settings").select("creditor_name, iban, twint_phone").eq("id", true).single(),
  ]);

  if (!quote) notFound();

  const { data: paymentRows } = await supabase
    .from("quote_payments")
    .select(PAYMENT_COLUMNS)
    .eq("quote_id", quote.id)
    .order("position");
  const payments = (paymentRows ?? []) as QuotePayment[];
  const { data: invoiceRows } = await supabase
    .from("invoices")
    .select("reference, public_token, created_at")
    .eq("quote_id", quote.id)
    .neq("status", "annulee")
    .order("created_at");

  const lang = ((quote.client_language as DevisLang | null) ?? "fr") as DevisLang;
  const t = DEVIS_I18N[lang];
  const tc = (quote.translated_content as TranslatedContent | null) ?? null;

  const client = quote.clients as unknown as { full_name: string; email: string | null; phone: string | null; address: string | null } | null;
  const items = (quote.items as { title?: string; description: string; quantity: number; unit: string; unit_price: number }[]) ?? [];
  const displayItems = items.map((it, i) => ({
    ...it,
    title: tc?.items?.[i]?.title ?? it.title,
    description: tc?.items?.[i]?.description ?? it.description,
    unit: tc?.items?.[i]?.unit ?? it.unit,
  }));
  const displayTitle = tc?.title ?? quote.title;
  const displayEventType = tc?.event_type ?? quote.event_type;
  const displayVenue = tc?.venue ?? quote.venue;
  const displayBalanceDueTerms = tc?.balance_due_terms ?? quote.balance_due_terms;
  const notes = resolveNotes({
    showNotes: quote.show_notes,
    notesText: quote.notes_text,
    translatedNotes: tc?.notes_text,
    lang,
  });

  const isPackageMode = quote.pricing_mode === "forfait";
  const subtotal = items.reduce((s, it) => s + it.quantity * it.unit_price, 0);
  const tax = isPackageMode ? 0 : subtotal * (quote.tax_rate / 100);
  const total = isPackageMode ? quote.package_total ?? 0 : subtotal + tax;
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
  // Les ajouts après signature s'ajoutent au solde
  const balanceAmount = total - depositAmount + (quote.signed_at ? supplementsTotal(quote.supplements) : 0);
  const paymentMethods = quote.payment_methods ?? [];
  const showPaymentBlock = hasDeposit || !!displayBalanceDueTerms || paymentMethods.length > 0;

  const referenceImages = (quote.reference_images as string[] | null) ?? [];
  const firstName = client?.full_name.split(" ")[0] ?? "";
  const eventLabel = displayTitle || displayEventType || t.event;
  const introText = t.intro(firstName, eventLabel, displayVenue ?? null);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-14">
      <div className="mb-8 rounded-2xl p-7" style={{ background: "var(--blush)" }}>
        <div className="flex items-center gap-2">
          <BalloonIcon />
          <div className="flex items-baseline gap-1.5">
            <span className="font-sans text-[15px] font-medium uppercase tracking-[0.14em]" style={{ color: "var(--noir)" }}>Event</span>
            <span className="font-serif italic text-[20px]" style={{ color: "#F4A8B8" }}>Fiesta</span>
          </div>
        </div>
        <p className="mt-1 font-sans text-[9.5px] uppercase tracking-[0.2em]" style={{ color: "rgba(13,11,8,0.45)" }}>
          {t.tagline}
        </p>
        <p className="mt-5 font-display text-[24px]" style={{ color: "var(--noir)" }}>{t.quoteWord} {quote.reference}</p>
        <p className="font-sans text-[12.5px]" style={{ color: "rgba(13,11,8,0.5)" }}>{fmtDate(quote.created_at, t.locale)}</p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="border-l-2 pl-3" style={{ borderColor: "var(--rose-deep)" }}>
          <p className="mb-1 font-sans text-[10px] uppercase tracking-[0.1em]" style={{ color: "rgba(13,11,8,0.4)" }}>{t.client}</p>
          <p className="font-sans text-[13.5px] leading-relaxed" style={{ color: "var(--noir)" }}>{client?.full_name}</p>
        </div>
        <div className="border-l-2 pl-3" style={{ borderColor: "var(--rose-deep)" }}>
          <p className="mb-1 font-sans text-[10px] uppercase tracking-[0.1em]" style={{ color: "rgba(13,11,8,0.4)" }}>{t.event}</p>
          <p className="font-sans text-[13.5px] leading-relaxed" style={{ color: "var(--noir)" }}>
            {displayTitle || displayEventType || "—"}
            {quote.event_date && <><br />{fmtDate(quote.event_date, t.locale)}</>}
            {displayVenue && <><br />{displayVenue}</>}
          </p>
        </div>
      </div>

      <p
        className="mb-6 border-b pb-4 font-sans text-[14px] leading-relaxed"
        style={{ borderColor: "rgba(13,11,8,0.1)", color: "var(--noir)" }}
      >
        {introText}
      </p>

      {isPackageMode ? (
        <>
          <div className="mb-6 overflow-hidden rounded-2xl bg-white" style={{ border: "1px solid rgba(13,11,8,0.1)" }}>
            <div className="hidden px-4 py-2.5 sm:flex" style={{ background: "var(--creme-2)" }}>
              <p className="w-40 shrink-0 font-sans text-[10px] uppercase tracking-[0.08em]" style={{ color: "rgba(13,11,8,0.45)" }}>{t.service}</p>
              <p className="font-sans text-[10px] uppercase tracking-[0.08em]" style={{ color: "rgba(13,11,8,0.45)" }}>{t.description}</p>
            </div>
            {displayItems.map((item, i) => (
              <div key={i} className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:gap-3" style={{ borderTop: i > 0 ? "1px solid rgba(13,11,8,0.06)" : undefined }}>
                <p className="font-sans text-[13.5px] font-semibold sm:w-40 sm:shrink-0 sm:text-[13px]" style={{ color: "var(--noir)" }}>{item.title || "—"}</p>
                <p className="font-sans text-[13px]" style={{ color: "rgba(13,11,8,0.7)" }}>{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mb-8 rounded-xl p-4 text-center" style={{ background: "var(--creme-2)", border: "1px solid rgba(217,98,138,0.25)" }}>
            <span className="font-display text-[17px]" style={{ color: "var(--noir)" }}>{t.packageTotalLabel} </span>
            <span className="font-display text-[17px]" style={{ color: "var(--rose-deep)" }}>{chf(total)}</span>
          </div>
        </>
      ) : (
        <>
          <div className="mb-6 overflow-hidden rounded-2xl bg-white" style={{ border: "1px solid rgba(13,11,8,0.1)" }}>
            <div className="flex items-center justify-between px-4 py-2.5" style={{ background: "var(--creme-2)" }}>
              <p className="font-sans text-[10px] uppercase tracking-[0.08em]" style={{ color: "rgba(13,11,8,0.45)" }}>{t.prestation}</p>
              <p className="font-sans text-[10px] uppercase tracking-[0.08em]" style={{ color: "rgba(13,11,8,0.45)" }}>{t.total}</p>
            </div>
            {displayItems.map((item, i) => (
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
              <span>{t.subtotal}</span><span>{chf(subtotal)}</span>
            </div>
            <div className="mt-1 flex justify-between font-sans text-[13px]" style={{ color: "rgba(13,11,8,0.6)" }}>
              <span>{t.vat(quote.tax_rate)}</span><span>{chf(tax)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t pt-2 font-display text-[16px]" style={{ borderColor: "rgba(13,11,8,0.15)", color: "var(--noir)" }}>
              <span>{t.total}</span><span style={{ color: "var(--rose-deep)" }}>{chf(total)}</span>
            </div>
          </div>
        </>
      )}

      {showPaymentBlock && (
        <div className="mb-8 rounded-2xl p-5" style={{ background: "var(--creme-2)" }}>
          <p className="mb-3 font-sans text-[10px] uppercase tracking-[0.1em]" style={{ color: "rgba(13,11,8,0.45)" }}>
            {t.paymentConditions}
          </p>

          {hasDeposit ? (
            <>
              <div className="flex justify-between font-sans text-[13px]" style={{ color: "rgba(13,11,8,0.6)" }}>
                <span>{t.depositAtOrder}{hasPercentDeposit ? ` (${depositPercent}%)` : ""}</span>
                <span className="font-semibold" style={{ color: "var(--noir)" }}>{chf(depositAmount)}</span>
              </div>
              <div className="mt-1 flex justify-between font-sans text-[13px]" style={{ color: "rgba(13,11,8,0.6)" }}>
                <span>{t.balance}{displayBalanceDueTerms ? ` — ${displayBalanceDueTerms}` : ""}</span>
                <span className="font-semibold" style={{ color: "var(--noir)" }}>{chf(balanceAmount)}</span>
              </div>
            </>
          ) : displayBalanceDueTerms ? (
            <div className="flex justify-between font-sans text-[13px]" style={{ color: "rgba(13,11,8,0.6)" }}>
              <span>{t.payment} — {displayBalanceDueTerms}</span>
              <span className="font-semibold" style={{ color: "var(--noir)" }}>{chf(total)}</span>
            </div>
          ) : null}

          {paymentMethods.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-4 border-t pt-3" style={{ borderColor: "rgba(13,11,8,0.08)" }}>
              {paymentMethods.includes("iban") && (
                <p className="font-sans text-[12px]" style={{ color: "rgba(13,11,8,0.55)" }}>
                  <span className="font-semibold" style={{ color: "var(--noir)" }}>{t.paymentMethodIban} : </span>
                  {settings?.iban ? (
                    <>
                      {settings.creditor_name ? `${settings.creditor_name} — ` : ""}
                      {settings.iban}
                    </>
                  ) : (
                    <>
                      {t.coordsOnWhatsapp}{" "}
                      <a href="https://wa.me/41779143855" target="_blank" rel="noreferrer" className="underline" style={{ color: "var(--rose-deep)" }}>
                        WhatsApp
                      </a>
                    </>
                  )}
                </p>
              )}
              {paymentMethods.includes("twint") && (
                <p className="font-sans text-[12px]" style={{ color: "rgba(13,11,8,0.55)" }}>
                  <span className="font-semibold" style={{ color: "var(--noir)" }}>{t.paymentMethodTwint} : </span>
                  {settings?.twint_phone || (
                    <a href="https://wa.me/41779143855" target="_blank" rel="noreferrer" className="underline" style={{ color: "var(--rose-deep)" }}>
                      {t.askTwintOnWhatsapp}
                    </a>
                  )}
                </p>
              )}
              {paymentMethods.includes("carte") && (
                <p className="font-sans text-[12px]" style={{ color: "rgba(13,11,8,0.55)" }}>
                  <span className="font-semibold" style={{ color: "var(--noir)" }}>{t.paymentMethodCarte}</span>
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {referenceImages.length > 0 && (
        <div className="mb-8">
          <p className="mb-3 font-sans text-[10px] uppercase tracking-[0.1em]" style={{ color: "rgba(13,11,8,0.45)" }}>
            {t.referenceImagesTitle}
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {referenceImages.map((url) => (
              <a key={url} href={url} target="_blank" rel="noreferrer" className="block aspect-square overflow-hidden rounded-xl" style={{ background: "var(--creme-2)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={t.referenceImagesTitle} className="h-full w-full object-cover" />
              </a>
            ))}
          </div>
        </div>
      )}

      {notes && (
        <div className="mb-8">
          <p className="mb-2 font-sans text-[10px] uppercase tracking-[0.1em]" style={{ color: "rgba(13,11,8,0.45)" }}>
            {t.notesTitle}
          </p>
          {notes.map((para, i) => (
            <p
              key={i}
              className={`${i < notes.length - 1 ? "mb-2 " : ""}whitespace-pre-line font-sans text-[11.5px] leading-relaxed`}
              style={{ color: "rgba(13,11,8,0.6)" }}
            >
              {para}
            </p>
          ))}
        </div>
      )}

      <p className="mb-6 text-center font-serif text-[16px] italic" style={{ color: "var(--rose-deep)" }}>
        {t.thankYou}
      </p>

      <a
        href="https://wa.me/41779143855"
        target="_blank"
        rel="noreferrer"
        className="mb-2 flex flex-col items-start gap-3 rounded-2xl px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-3"
        style={{ background: "var(--rose-deep)" }}
      >
        <span className="font-sans text-[13.5px]" style={{ color: "var(--creme)" }}>{t.ctaQuestion}</span>
        <span
          className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 font-sans text-[13px] font-semibold"
          style={{ background: "var(--creme)", color: "var(--rose-deep)" }}
        >
          <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
            <path d="M187.58,144.84l-32-16a8,8,0,0,0-8,.5l-14.69,9.8a40.55,40.55,0,0,1-16-16l9.8-14.69a8,8,0,0,0,.5-8l-16-32A8,8,0,0,0,104,64a40,40,0,0,0-40,40,88.1,88.1,0,0,0,88,88,40,40,0,0,0,40-40A8,8,0,0,0,187.58,144.84ZM152,176a72.08,72.08,0,0,1-72-72A24,24,0,0,1,99.29,80.46l11.48,23L101,118a8,8,0,0,0-.73,7.51,56.47,56.47,0,0,0,30.15,30.15A8,8,0,0,0,138,155l14.61-9.74,23,11.48A24,24,0,0,1,152,176ZM128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z" />
          </svg>
          WhatsApp +41 77 914 38 55
        </span>
      </a>
      <p className="mb-6 text-center font-sans text-[11px]" style={{ color: "rgba(13,11,8,0.4)" }}>
        {t.validity}
      </p>

      <a
        href={`/devis/${token}/pdf`}
        className="mb-8 flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-sans text-[13px] font-medium transition-colors hover:bg-black/[0.03]"
        style={{ border: "1px solid rgba(13,11,8,0.14)", color: "var(--noir)" }}
      >
        <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
          <path d="M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,124.69V32a8,8,0,0,0-16,0v92.69L93.66,98.34a8,8,0,0,0-11.32,11.32Z" />
        </svg>
        {t.downloadPdf}
      </a>

      {isSigned ? (
        <div className="rounded-2xl p-6" style={{ background: "var(--blush)" }}>
          <p className="font-display text-[19px]" style={{ color: "var(--noir)" }}>{t.signedTitle}</p>
          <p className="mt-1 font-sans text-[14px]" style={{ color: "var(--noir)" }}>
            {t.acceptedOn(formatSignedAt(quote.signed_at as string, t.locale).date, formatSignedAt(quote.signed_at as string, t.locale).time)}
          </p>
          <p className="mt-0.5 font-sans text-[12.5px]" style={{ color: "rgba(13,11,8,0.55)" }}>
            {t.signedBy(quote.signed_by ?? "", fmtDate(quote.signed_at, t.locale))}
          </p>
          {quote.signature_data && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={quote.signature_data} alt={t.signatureLabel} className="mt-3 h-20 rounded-lg bg-white p-2" />
          )}
        </div>
      ) : (
        <SignaturePadClient token={token} lang={lang} />
      )}

      {isSigned && activeSupplements(quote.supplements).length > 0 && (
        <SupplementsBlock
          token={token}
          lang={lang}
          locale={t.locale}
          supplements={activeSupplements(quote.supplements)}
          baseTotal={total}
        />
      )}

      {isSigned && (
        <PaymentTracker
          lang={lang}
          locale={t.locale}
          reference={quote.reference}
          signedAt={quote.signed_at as string}
          eventDate={quote.event_date}
          payments={payments}
          balanceTerms={displayBalanceDueTerms ?? null}
          twintPhone={settings?.twint_phone ?? null}
          showTransfer={(quote.payment_methods ?? []).includes("iban")}
          iban={settings?.iban ?? null}
          creditorName={settings?.creditor_name ?? null}
        />
      )}

      {isSigned && (invoiceRows ?? []).length > 0 && (
        <div className="mt-4 rounded-2xl bg-white p-5" style={{ border: "1px solid rgba(13,11,8,0.08)" }}>
          <p className="mb-2 font-sans text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: "rgba(13,11,8,0.5)" }}>
            {{ fr: "Vos factures", es: "Tus facturas", en: "Your invoices" }[lang]}
          </p>
          {(invoiceRows ?? []).map((inv) => (
            <a
              key={inv.public_token}
              href={`/facture/${inv.public_token}/pdf`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-3 py-2 font-sans text-[13.5px]"
              style={{ color: "var(--noir)" }}
            >
              <span className="font-medium">{inv.reference}</span>
              <span style={{ color: "var(--rose-deep)" }}>PDF ↓</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
