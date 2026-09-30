"use client";

import { useState, useTransition } from "react";
import { Plus, Trash } from "@phosphor-icons/react";
import { createQuote, updateQuote, type QuoteItem } from "./actions";

const inputCls = "w-full rounded-xl bg-white px-3.5 py-2.5 font-sans text-[13.5px] outline-none";
const inputStyle = { border: "1px solid rgba(13,11,8,0.14)", color: "var(--noir)" } as const;
const labelCls = "mb-1 block font-sans text-[11px] uppercase tracking-[0.1em]";
const labelStyle = { color: "rgba(13,11,8,0.5)" };

function chf(n: number) {
  return "CHF " + n.toLocaleString("fr-CH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export type QuoteFormValues = {
  title: string;
  event_type: string;
  event_date: string;
  venue: string;
  tax_rate: number;
  items: QuoteItem[];
};

const EMPTY_ITEM: QuoteItem = { description: "", quantity: 1, unit: "forfait", unit_price: 0 };

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
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
  const total = subtotal + tax;

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
        <p className="mb-3 font-sans text-[13px] font-semibold" style={{ color: "var(--noir)" }}>Prestations</p>
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <div key={i} className="grid grid-cols-[1fr_70px_90px_110px_28px] items-center gap-2">
              <input
                value={item.description}
                onChange={(e) => updateItem(i, "description", e.target.value)}
                placeholder="Description de la prestation…"
                className={inputCls}
                style={inputStyle}
              />
              <input
                type="number"
                min={0}
                value={item.quantity}
                onChange={(e) => updateItem(i, "quantity", parseFloat(e.target.value) || 0)}
                className={inputCls + " text-right"}
                style={inputStyle}
              />
              <input
                value={item.unit}
                onChange={(e) => updateItem(i, "unit", e.target.value)}
                placeholder="unité"
                className={inputCls}
                style={inputStyle}
              />
              <input
                type="number"
                min={0}
                value={item.unit_price}
                onChange={(e) => updateItem(i, "unit_price", parseFloat(e.target.value) || 0)}
                className={inputCls + " text-right"}
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-black/5"
                style={{ color: "rgba(13,11,8,0.35)" }}
              >
                <Trash size={14} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addItem}
          className="mt-3 flex items-center gap-1.5 rounded-xl px-3 py-2 font-sans text-[12.5px] font-medium"
          style={{ border: "1px dashed rgba(13,11,8,0.2)", color: "rgba(13,11,8,0.6)" }}
        >
          <Plus size={13} /> Ajouter une ligne
        </button>

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
