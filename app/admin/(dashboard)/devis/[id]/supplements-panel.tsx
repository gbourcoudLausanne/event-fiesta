"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, CheckCircle, Clock } from "@phosphor-icons/react";
import type { Supplement } from "@/lib/quote-supplements";
import { addSupplement, removeSupplement } from "../supplement-actions";

const inputCls = "w-full rounded-xl bg-white px-3.5 py-2.5 font-sans text-[13.5px] outline-none";
const inputStyle = { border: "1px solid rgba(13,11,8,0.14)", color: "var(--noir)" } as const;

function chf(n: number) {
  const [intPart, decPart] = n.toFixed(2).split(".");
  return `CHF ${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'")},${decPart}`;
}
function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("fr-CH", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Zurich" });
}

export default function SupplementsPanel({
  quoteId,
  supplements,
  baseTotal,
}: {
  quoteId: string;
  supplements: Supplement[];
  baseTotal: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const active = supplements.filter((s) => !s.removed_at);
  const extra = active.reduce((sum, s) => sum + Number(s.amount), 0);

  function run(fn: () => Promise<{ error?: string }>, onOk?: () => void) {
    setError(null);
    startTransition(async () => {
      const res = await fn();
      if (res.error) setError(res.error);
      else onOk?.();
      router.refresh();
    });
  }

  return (
    <div className="mb-6 rounded-2xl bg-white p-4 md:p-5" style={{ border: "1px solid rgba(13,11,8,0.08)" }}>
      <div className="mb-1 flex items-center justify-between gap-3">
        <p className="font-sans text-[13.5px] font-semibold" style={{ color: "var(--noir)" }}>
          Ajouts après signature
        </p>
        {!open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center gap-1 rounded-xl px-3 py-2 font-sans text-[12.5px] font-medium"
            style={{ background: "var(--rose-deep)", color: "var(--creme)" }}
          >
            <Plus size={13} weight="bold" /> Ajouter
          </button>
        )}
      </div>
      <p className="mb-3 font-sans text-[12px]" style={{ color: "rgba(13,11,8,0.5)" }}>
        Le client demande quelque chose en plus : l&apos;ajout apparaît dans son devis (lien + PDF), le solde est ajusté, et il le confirme d&apos;un toucher.
      </p>

      {error && (
        <div className="mb-3 rounded-xl px-4 py-2.5 font-sans text-[13px]" style={{ background: "rgba(217,98,138,0.1)", color: "#B0546F" }}>
          {error}
        </div>
      )}

      {open && (
        <div className="mb-3 grid grid-cols-[1fr_110px] gap-2 rounded-xl p-3" style={{ background: "var(--creme-2)" }}>
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex : 2 arches de ballons en plus" className={inputCls} style={inputStyle} autoFocus />
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step={0.05}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="CHF"
            className={inputCls + " text-right"}
            style={inputStyle}
          />
          <div className="col-span-2 grid grid-cols-2 gap-2 sm:flex sm:justify-end">
            <button type="button" onClick={() => setOpen(false)} className="rounded-xl bg-white px-4 py-2.5 font-sans text-[13px]" style={{ border: "1px solid rgba(13,11,8,0.14)" }}>
              Annuler
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() =>
                run(
                  () => addSupplement(quoteId, { description, amount: parseFloat(amount) || 0 }),
                  () => {
                    setDescription("");
                    setAmount("");
                    setOpen(false);
                  },
                )
              }
              className="rounded-xl px-4 py-2.5 font-sans text-[13px] font-medium disabled:opacity-60"
              style={{ background: "var(--rose-deep)", color: "var(--creme)" }}
            >
              {isPending ? "Ajout…" : "Ajouter au devis"}
            </button>
          </div>
        </div>
      )}

      {active.length > 0 && (
        <>
          {active.map((s) => (
            <div key={s.id} className="flex items-start justify-between gap-3 py-2.5" style={{ borderTop: "1px solid rgba(13,11,8,0.06)" }}>
              <div className="min-w-0">
                <p className="font-sans text-[13.5px] font-medium" style={{ color: "var(--noir)" }}>{s.description}</p>
                <p className="flex items-center gap-1 font-sans text-[11.5px]" style={{ color: s.accepted_at ? "#3B7D55" : "rgba(13,11,8,0.5)" }}>
                  {s.accepted_at ? <CheckCircle size={12} weight="fill" /> : <Clock size={12} />}
                  Ajouté le {fmt(s.added_at)} · {s.accepted_at ? `confirmé par le client le ${fmt(s.accepted_at)}` : "en attente de confirmation du client"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <span className="font-sans text-[13.5px] font-semibold" style={{ color: "var(--noir)" }}>+ {chf(Number(s.amount))}</span>
                {confirmRemove === s.id ? (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => run(() => removeSupplement(quoteId, s.id), () => setConfirmRemove(null))}
                    className="ml-1 rounded-lg px-2 py-1.5 font-sans text-[11.5px] font-semibold"
                    style={{ background: "#B0546F", color: "#fff" }}
                  >
                    Retirer ?
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmRemove(s.id)}
                    aria-label="Retirer l'ajout"
                    className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-black/5"
                    style={{ color: "rgba(13,11,8,0.4)" }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
          <div className="mt-1 flex flex-col items-end gap-0.5 pt-2.5 font-sans text-[13px]" style={{ borderTop: "1px solid rgba(13,11,8,0.08)" }}>
            <span style={{ color: "rgba(13,11,8,0.55)" }}>Devis signé : {chf(baseTotal)}</span>
            <span style={{ color: "rgba(13,11,8,0.55)" }}>Ajouts : + {chf(extra)}</span>
            <span className="font-semibold" style={{ color: "var(--noir)" }}>Nouveau total : {chf(baseTotal + extra)}</span>
          </div>
        </>
      )}
    </div>
  );
}
