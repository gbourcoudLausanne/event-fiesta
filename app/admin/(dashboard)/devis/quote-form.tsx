"use client";

import { useState, useTransition } from "react";
import { Plus, Trash } from "@phosphor-icons/react";
import { createQuote, updateQuote, type QuoteItem } from "./actions";

const inputCls = "w-full rounded-xl bg-white px-3.5 py-2.5 font-sans text-[13.5px] outline-none";
const inputStyle = { border: "1px solid rgba(13,11,8,0.14)", color: "var(--noir)" } as const;
const labelCls = "mb-1 block font-sans text-[11px] uppercase tracking-[0.1em]";
const labelStyle = { color: "rgba(13,11,8,0.5)" };

function chf(n: number) {
  const [intPart, decPart] = n.toFixed(2).split(".");
  return `CHF ${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'")},${decPart}`;
}

export type QuoteFormValues = {
  title: string;
  event_type: string;
  event_date: string;
  venue: string;
  tax_rate: number;
  items: QuoteItem[];
  deposit_percent: number | null;
  deposit_amount: number | null;
  balance_due_terms: string;
  payment_methods: string[];
  pricing_mode: "detaille" | "forfait";
  package_total: number | null;
};

const EMPTY_ITEM: QuoteItem = { title: "", description: "", quantity: 1, unit: "forfait", unit_price: 0 };

const DEPOSIT_PRESETS = [0, 30, 50, 100];
const BALANCE_PRESETS = [
  "À la signature du devis",
  "7 jours avant l'événement",
  "30 jours avant l'événement",
  "À réception de facture",
];
const PAYMENT_METHOD_OPTIONS: { value: string; label: string }[] = [
  { value: "iban", label: "Virement bancaire (IBAN)" },
  { value: "twint", label: "Twint" },
  { value: "carte", label: "Carte bancaire sur place" },
];

export default function QuoteForm({
  clientId,
  quoteId,
  initial,
}: {
  clientId: string;
  quoteId?: string;
  initial?: QuoteFormValues;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [eventType, setEventType] = useState(initial?.event_type ?? "");
  const [eventDate, setEventDate] = useState(initial?.event_date ?? "");
  const [venue, setVenue] = useState(initial?.venue ?? "");
  const [taxRate, setTaxRate] = useState(initial?.tax_rate ?? 0);
  const [items, setItems] = useState<QuoteItem[]>(initial?.items?.length ? initial.items : [{ ...EMPTY_ITEM }]);
  const [pricingMode, setPricingMode] = useState<"detaille" | "forfait">(initial?.pricing_mode ?? "detaille");
  const [packageTotal, setPackageTotal] = useState<number | null>(initial?.package_total ?? null);
  const [depositMode, setDepositMode] = useState<"percent" | "amount">(initial?.deposit_amount ? "amount" : "percent");
  const [depositPercent, setDepositPercent] = useState<number | null>(initial?.deposit_percent ?? null);
  const [depositAmount, setDepositAmount] = useState<number | null>(initial?.deposit_amount ?? null);
  const [balanceDueTerms, setBalanceDueTerms] = useState(initial?.balance_due_terms ?? "");
  const [paymentMethods, setPaymentMethods] = useState<string[]>(initial?.payment_methods ?? []);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function togglePaymentMethod(value: string) {
    setPaymentMethods((prev) => (prev.includes(value) ? prev.filter((m) => m !== value) : [...prev, value]));
  }

  function updateItem(index: number, field: keyof QuoteItem, value: string | number) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, [field]: value } : it)));
  }

  function addItem() {
    setItems((prev) => [...prev, { ...EMPTY_ITEM }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  const subtotal = items.reduce((s, it) => s + it.quantity * it.unit_price, 0);
  const tax = subtotal * (taxRate / 100);
  const total = pricingMode === "forfait" ? packageTotal ?? 0 : subtotal + tax;
  const depositPreviewAmount = depositPercent ? total * (depositPercent / 100) : 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const cleanItems = items.filter((it) => it.description.trim());
    if (cleanItems.length === 0) {
      setError("Ajoute au moins une ligne avec une description.");
      return;
    }
    const payload = {
      title,
      event_type: eventType,
      event_date: eventDate || null,
      venue,
      tax_rate: taxRate,
      items: cleanItems,
      deposit_percent: depositMode === "percent" ? depositPercent : null,
      deposit_amount: depositMode === "amount" ? depositAmount : null,
      balance_due_terms: balanceDueTerms || null,
      payment_methods: paymentMethods,
      pricing_mode: pricingMode,
      package_total: pricingMode === "forfait" ? packageTotal : null,
    };
    startTransition(async () => {
      if (quoteId) {
        await updateQuote(quoteId, payload);
      } else {
        const res = await createQuote({ client_id: clientId, ...payload });
        if (res?.error) setError(res.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="rounded-xl px-4 py-3 font-sans text-[13px]" style={{ background: "rgba(217,98,138,0.1)", color: "#B0546F" }}>
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 rounded-2xl bg-white p-5" style={{ border: "1px solid rgba(13,11,8,0.08)" }}>
        <div className="col-span-2">
          <label className={labelCls} style={labelStyle}>Intitulé</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="ex: Décoration 40e anniversaire" className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className={labelCls} style={labelStyle}>Type d&apos;événement</label>
          <input value={eventType} onChange={(e) => setEventType(e.target.value)} placeholder="ex: Anniversaire" className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className={labelCls} style={labelStyle}>Date</label>
          <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className={labelCls} style={labelStyle}>Lieu</label>
          <input value={venue} onChange={(e) => setVenue(e.target.value)} className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className={labelCls} style={labelStyle}>TVA %</label>
          <input type="number" min={0} step={0.1} value={taxRate} onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)} className={inputCls} style={inputStyle} />
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5" style={{ border: "1px solid rgba(13,11,8,0.08)" }}>
        <div className="mb-3 flex items-center justify-between">
          <p className="font-sans text-[13px] font-semibold" style={{ color: "var(--noir)" }}>Prestations</p>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setPricingMode("detaille")}
              className="rounded-lg px-2.5 py-1 font-sans text-[11.5px] font-medium"
              style={{
                background: pricingMode === "detaille" ? "var(--rose-deep)" : "transparent",
                color: pricingMode === "detaille" ? "var(--creme)" : "rgba(13,11,8,0.5)",
                border: pricingMode === "detaille" ? "1px solid var(--rose-deep)" : "1px solid rgba(13,11,8,0.14)",
              }}
            >
              Détaillé (prix par ligne)
            </button>
            <button
              type="button"
              onClick={() => setPricingMode("forfait")}
              className="rounded-lg px-2.5 py-1 font-sans text-[11.5px] font-medium"
              style={{
                background: pricingMode === "forfait" ? "var(--rose-deep)" : "transparent",
                color: pricingMode === "forfait" ? "var(--creme)" : "rgba(13,11,8,0.5)",
                border: pricingMode === "forfait" ? "1px solid var(--rose-deep)" : "1px solid rgba(13,11,8,0.14)",
              }}
            >
              Forfait global (un seul prix)
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {items.map((item, i) => (
            <div key={i} className="rounded-xl p-3" style={{ border: "1px solid rgba(13,11,8,0.1)" }}>
              {pricingMode === "forfait" && (
                <input
                  value={item.title ?? ""}
                  onChange={(e) => updateItem(i, "title", e.target.value)}
                  placeholder="Nom du service (ex: Décoration principale)"
                  className={inputCls + " mb-2 font-semibold"}
                  style={inputStyle}
                />
              )}
              <textarea
                value={item.description}
                onChange={(e) => {
                  updateItem(i, "description", e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                ref={(el) => {
                  if (el) {
                    el.style.height = "auto";
                    el.style.height = `${el.scrollHeight}px`;
                  }
                }}
                placeholder="Description de la prestation… (peut être longue, ex: un forfait complet)"
                rows={1}
                className="w-full resize-none overflow-hidden rounded-lg bg-white px-3 py-2 font-sans text-[13.5px] leading-relaxed outline-none"
                style={{ border: "1px solid rgba(13,11,8,0.12)", color: "var(--noir)" }}
              />
              {pricingMode === "detaille" ? (
                <div className="mt-2 flex items-end gap-2">
                  <div className="w-[72px]">
                    <label className="mb-1 block font-sans text-[9.5px] uppercase tracking-[0.08em]" style={{ color: "rgba(13,11,8,0.45)" }}>
                      Qté
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={item.quantity}
                      onChange={(e) => updateItem(i, "quantity", parseFloat(e.target.value) || 0)}
                      className={inputCls + " text-right"}
                      style={inputStyle}
                    />
                  </div>
                  <div className="w-[100px]">
                    <label className="mb-1 block font-sans text-[9.5px] uppercase tracking-[0.08em]" style={{ color: "rgba(13,11,8,0.45)" }}>
                      Unité
                    </label>
                    <input
                      value={item.unit}
                      onChange={(e) => updateItem(i, "unit", e.target.value)}
                      placeholder="forfait"
                      className={inputCls}
                      style={inputStyle}
                    />
                  </div>
                  <div className="w-[120px]">
                    <label className="mb-1 block font-sans text-[9.5px] uppercase tracking-[0.08em]" style={{ color: "rgba(13,11,8,0.45)" }}>
                      Prix unitaire
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={item.unit_price}
                      onChange={(e) => updateItem(i, "unit_price", parseFloat(e.target.value) || 0)}
                      className={inputCls + " text-right"}
                      style={inputStyle}
                    />
                  </div>
                  <div className="flex-1 text-right">
                    <p className="mb-1 font-sans text-[9.5px] uppercase tracking-[0.08em]" style={{ color: "rgba(13,11,8,0.45)" }}>
                      Total ligne
                    </p>
                    <p className="py-2.5 font-sans text-[13.5px] font-semibold" style={{ color: "var(--noir)" }}>
                      {chf(item.quantity * item.unit_price)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-black/5"
                    style={{ color: "rgba(13,11,8,0.35)" }}
                  >
                    <Trash size={14} />
                  </button>
                </div>
              ) : (
                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-black/5"
                    style={{ color: "rgba(13,11,8,0.35)" }}
                  >
                    <Trash size={14} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addItem}
          className="mt-3 flex items-center gap-1.5 rounded-xl px-3 py-2 font-sans text-[12.5px] font-medium"
          style={{ border: "1px dashed rgba(13,11,8,0.2)", color: "rgba(13,11,8,0.6)" }}
        >
          <Plus size={13} /> {pricingMode === "forfait" ? "Ajouter un service" : "Ajouter une ligne"}
        </button>

        {pricingMode === "detaille" ? (
          <div className="mt-5 flex flex-col items-end gap-1 border-t pt-4 font-sans text-[13.5px]" style={{ borderColor: "rgba(13,11,8,0.08)" }}>
            <div className="flex w-56 justify-between" style={{ color: "rgba(13,11,8,0.6)" }}>
              <span>Sous-total</span><span>{chf(subtotal)}</span>
            </div>
            <div className="flex w-56 justify-between" style={{ color: "rgba(13,11,8,0.6)" }}>
              <span>TVA ({taxRate}%)</span><span>{chf(tax)}</span>
            </div>
            <div className="flex w-56 justify-between font-semibold" style={{ color: "var(--noir)" }}>
              <span>Total</span><span>{chf(total)}</span>
            </div>
          </div>
        ) : (
          <div className="mt-5 flex items-center justify-end gap-3 border-t pt-4" style={{ borderColor: "rgba(13,11,8,0.08)" }}>
            <label className="font-sans text-[13px]" style={{ color: "rgba(13,11,8,0.6)" }}>Prix total du forfait</label>
            <span className="font-sans text-[13px]" style={{ color: "rgba(13,11,8,0.5)" }}>CHF</span>
            <input
              type="number"
              min={0}
              step={0.05}
              value={packageTotal ?? ""}
              onChange={(e) => setPackageTotal(e.target.value === "" ? null : parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className={inputCls + " w-32 text-right font-semibold"}
              style={inputStyle}
            />
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-white p-5" style={{ border: "1px solid rgba(13,11,8,0.08)" }}>
        <p className="mb-3 font-sans text-[13px] font-semibold" style={{ color: "var(--noir)" }}>Conditions de paiement</p>

        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <label className={labelCls} style={{ ...labelStyle, marginBottom: 0 }}>Acompte à la commande</label>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setDepositMode("percent")}
                className="rounded-lg px-2.5 py-1 font-sans text-[11.5px] font-medium"
                style={{
                  background: depositMode === "percent" ? "var(--rose-deep)" : "transparent",
                  color: depositMode === "percent" ? "var(--creme)" : "rgba(13,11,8,0.5)",
                  border: depositMode === "percent" ? "1px solid var(--rose-deep)" : "1px solid rgba(13,11,8,0.14)",
                }}
              >
                %
              </button>
              <button
                type="button"
                onClick={() => setDepositMode("amount")}
                className="rounded-lg px-2.5 py-1 font-sans text-[11.5px] font-medium"
                style={{
                  background: depositMode === "amount" ? "var(--rose-deep)" : "transparent",
                  color: depositMode === "amount" ? "var(--creme)" : "rgba(13,11,8,0.5)",
                  border: depositMode === "amount" ? "1px solid var(--rose-deep)" : "1px solid rgba(13,11,8,0.14)",
                }}
              >
                CHF fixe
              </button>
            </div>
          </div>

          {depositMode === "percent" ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={100}
                value={depositPercent ?? ""}
                onChange={(e) => setDepositPercent(e.target.value === "" ? null : parseFloat(e.target.value) || 0)}
                placeholder="0"
                className={inputCls + " w-24"}
                style={inputStyle}
              />
              <span className="font-sans text-[13px]" style={{ color: "rgba(13,11,8,0.5)" }}>%</span>
              <div className="ml-2 flex gap-1.5">
                {DEPOSIT_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setDepositPercent(p)}
                    className="rounded-lg px-2.5 py-1 font-sans text-[12px]"
                    style={{
                      background: depositPercent === p ? "var(--blush)" : "transparent",
                      color: depositPercent === p ? "var(--rose-deep)" : "rgba(13,11,8,0.5)",
                      border: "1px solid rgba(13,11,8,0.1)",
                    }}
                  >
                    {p}%
                  </button>
                ))}
              </div>
              {!!depositPercent && (
                <span className="ml-1 font-sans text-[12.5px] font-medium" style={{ color: "var(--rose-deep)" }}>
                  ≈ {chf(depositPreviewAmount)}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-sans text-[13px]" style={{ color: "rgba(13,11,8,0.5)" }}>CHF</span>
              <input
                type="number"
                min={0}
                step={0.05}
                value={depositAmount ?? ""}
                onChange={(e) => setDepositAmount(e.target.value === "" ? null : parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className={inputCls + " w-32"}
                style={inputStyle}
              />
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className={labelCls} style={labelStyle}>Solde — échéance</label>
          <input
            value={balanceDueTerms}
            onChange={(e) => setBalanceDueTerms(e.target.value)}
            placeholder="ex: 7 jours avant l'événement"
            className={inputCls}
            style={inputStyle}
          />
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {BALANCE_PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setBalanceDueTerms(p)}
                className="rounded-lg px-2.5 py-1 font-sans text-[12px]"
                style={{
                  background: balanceDueTerms === p ? "var(--blush)" : "transparent",
                  color: balanceDueTerms === p ? "var(--rose-deep)" : "rgba(13,11,8,0.5)",
                  border: "1px solid rgba(13,11,8,0.1)",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelCls} style={labelStyle}>Moyens de paiement proposés</label>
          <div className="flex flex-wrap gap-2">
            {PAYMENT_METHOD_OPTIONS.map((opt) => {
              const active = paymentMethods.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => togglePaymentMethod(opt.value)}
                  className="rounded-xl px-3 py-2 font-sans text-[12.5px]"
                  style={{
                    background: active ? "var(--rose-deep)" : "transparent",
                    color: active ? "var(--creme)" : "rgba(13,11,8,0.6)",
                    border: active ? "1px solid var(--rose-deep)" : "1px solid rgba(13,11,8,0.14)",
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-2xl px-6 py-3 font-sans text-[13.5px] font-medium disabled:opacity-60"
        style={{ background: "var(--rose-deep)", color: "var(--creme)" }}
      >
        {isPending ? "Enregistrement…" : quoteId ? "Enregistrer" : "Créer le devis"}
      </button>
    </form>
  );
}
