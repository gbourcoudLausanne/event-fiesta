"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, PencilSimple, Plus, Trash, ArrowCounterClockwise } from "@phosphor-icons/react";
import type { QuotePayment } from "@/lib/quote-payments";
import {
  addPayment,
  createPaymentSchedule,
  deletePayment,
  markPaymentPaid,
  markPaymentUnpaid,
  updatePayment,
} from "../payment-actions";

const KIND_LABEL: Record<string, string> = { acompte: "Acompte", solde: "Solde", autre: "Paiement" };
const METHODS = [
  { value: "twint", label: "Twint" },
  { value: "virement", label: "Virement" },
  { value: "especes", label: "Espèces" },
  { value: "carte", label: "Carte" },
] as const;
type Method = (typeof METHODS)[number]["value"];

const inputCls = "w-full rounded-xl bg-white px-3 py-2 font-sans text-[13.5px] outline-none";
const inputStyle = { border: "1px solid rgba(13,11,8,0.14)", color: "var(--noir)" } as const;

function chf(n: number) {
  const [intPart, decPart] = n.toFixed(2).split(".");
  return `CHF ${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'")},${decPart}`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-CH", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Zurich" });
}

function PaymentRow({ p, balanceTerms, hasClientEmail }: { p: QuotePayment; balanceTerms: string | null; hasClientEmail: boolean }) {
  const router = useRouter();
  const [mode, setMode] = useState<"view" | "pay" | "edit">("view");
  const [method, setMethod] = useState<Method>("twint");
  const [notify, setNotify] = useState(hasClientEmail);
  const [label, setLabel] = useState(p.label ?? "");
  const [amount, setAmount] = useState(String(p.amount));
  const [due, setDue] = useState(p.due_label ?? "");
  const [msg, setMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const title = p.label?.trim() || KIND_LABEL[p.kind];
  const dueText = p.due_label?.trim() || (p.kind === "acompte" ? "Dès la signature" : balanceTerms || "—");
  const paid = p.status === "paye";

  function run(fn: () => Promise<unknown>, after?: (r: unknown) => void) {
    setMsg(null);
    startTransition(async () => {
      const r = await fn();
      after?.(r);
      router.refresh();
    });
  }

  return (
    <div className="py-3" style={{ borderTop: "1px solid rgba(13,11,8,0.06)" }}>
      {mode === "edit" ? (
        <div className="grid grid-cols-2 gap-2">
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder={KIND_LABEL[p.kind]} className={inputCls + " col-span-2 sm:col-span-1"} style={inputStyle} />
          <input type="number" inputMode="decimal" step={0.05} min={0} value={amount} onChange={(e) => setAmount(e.target.value)} className={inputCls + " col-span-2 text-right sm:col-span-1"} style={inputStyle} />
          <input value={due} onChange={(e) => setDue(e.target.value)} placeholder={`Échéance (vide = ${dueText})`} className={inputCls + " col-span-2"} style={inputStyle} />
          <div className="col-span-2 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => run(() => deletePayment(p.id))}
              disabled={isPending}
              className="flex items-center gap-1 rounded-lg px-2.5 py-2 font-sans text-[12px]"
              style={{ color: "#B0546F" }}
            >
              <Trash size={14} /> Supprimer l&apos;étape
            </button>
            <div className="flex gap-2">
              <button type="button" onClick={() => setMode("view")} className="rounded-xl px-3.5 py-2 font-sans text-[12.5px]" style={{ border: "1px solid rgba(13,11,8,0.14)" }}>
                Annuler
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() =>
                  run(
                    () => updatePayment(p.id, { label, amount: parseFloat(amount) || 0, due_label: due }),
                    () => setMode("view"),
                  )
                }
                className="rounded-xl px-3.5 py-2 font-sans text-[12.5px] font-medium disabled:opacity-60"
                style={{ background: "var(--rose-deep)", color: "var(--creme)" }}
              >
                {isPending ? "…" : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-sans text-[14px] font-semibold" style={{ color: "var(--noir)" }}>
                {title} · {chf(Number(p.amount))}
              </p>
              <p className="font-sans text-[12px]" style={{ color: paid ? "#3B7D55" : "rgba(13,11,8,0.5)" }}>
                {paid && p.paid_at
                  ? `Payé le ${fmtDate(p.paid_at)}${p.method ? ` · ${METHODS.find((m) => m.value === p.method)?.label}` : ""}`
                  : dueText}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {paid ? (
                <button
                  type="button"
                  onClick={() => run(() => markPaymentUnpaid(p.id))}
                  disabled={isPending}
                  title="Annuler le paiement"
                  className="flex h-9 items-center gap-1 rounded-lg px-2 font-sans text-[12px]"
                  style={{ color: "rgba(13,11,8,0.45)" }}
                >
                  <ArrowCounterClockwise size={14} /> Annuler
                </button>
              ) : (
                mode === "view" && (
                  <>
                    <button
                      type="button"
                      onClick={() => setMode("edit")}
                      aria-label="Modifier"
                      className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-black/5"
                      style={{ color: "rgba(13,11,8,0.45)" }}
                    >
                      <PencilSimple size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("pay")}
                      className="rounded-xl px-3 py-2 font-sans text-[12.5px] font-medium"
                      style={{ background: "#4C9A6A", color: "#fff" }}
                    >
                      Marquer payé
                    </button>
                  </>
                )
              )}
            </div>
          </div>

          {mode === "pay" && (
            <div className="mt-3 rounded-xl p-3" style={{ background: "var(--creme-2)" }}>
              <p className="mb-2 font-sans text-[11px] uppercase tracking-[0.1em]" style={{ color: "rgba(13,11,8,0.5)" }}>
                Reçu par
              </p>
              <div className="mb-3 grid grid-cols-4 gap-1.5">
                {METHODS.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setMethod(m.value)}
                    className="rounded-lg px-2 py-2 font-sans text-[12px] font-medium"
                    style={
                      method === m.value
                        ? { background: "var(--rose-deep)", color: "var(--creme)" }
                        : { background: "#fff", color: "rgba(13,11,8,0.6)", border: "1px solid rgba(13,11,8,0.12)" }
                    }
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <label className={`mb-3 flex items-center gap-2 font-sans text-[12.5px] ${hasClientEmail ? "" : "opacity-50"}`} style={{ color: "var(--noir)" }}>
                <input type="checkbox" checked={notify} disabled={!hasClientEmail} onChange={(e) => setNotify(e.target.checked)} className="h-4 w-4 accent-[#B0546F]" />
                {hasClientEmail ? "Prévenir le client par e-mail (avec la prochaine étape)" : "Pas d'e-mail sur la fiche client"}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setMode("view")} className="rounded-xl bg-white px-3 py-2.5 font-sans text-[13px]" style={{ border: "1px solid rgba(13,11,8,0.14)" }}>
                  Annuler
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    run(
                      () => markPaymentPaid(p.id, method, notify),
                      (r) => {
                        const res = r as { error?: string; emailed?: boolean };
                        setMode("view");
                        setMsg(res.error ?? (res.emailed ? "Paiement enregistré, client prévenu." : "Paiement enregistré."));
                      },
                    )
                  }
                  className="flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 font-sans text-[13px] font-medium disabled:opacity-60"
                  style={{ background: "#4C9A6A", color: "#fff" }}
                >
                  <CheckCircle size={16} weight="fill" /> {isPending ? "…" : "Confirmer"}
                </button>
              </div>
            </div>
          )}
        </>
      )}
      {msg && (
        <p className="mt-2 font-sans text-[12px]" style={{ color: msg.includes("pas pu") ? "#B0546F" : "#3B7D55" }}>
          {msg}
        </p>
      )}
    </div>
  );
}

export default function PaymentsPanel({
  quoteId,
  payments,
  balanceTerms,
  hasClientEmail,
}: {
  quoteId: string;
  payments: QuotePayment[];
  balanceTerms: string | null;
  hasClientEmail: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const remaining = payments.filter((p) => p.status !== "paye").reduce((s, p) => s + Number(p.amount), 0);
  const total = payments.reduce((s, p) => s + Number(p.amount), 0);

  function run(fn: () => Promise<unknown>) {
    startTransition(async () => {
      await fn();
      router.refresh();
    });
  }

  return (
    <div className="mb-6 rounded-2xl bg-white p-4 md:p-5" style={{ border: "1px solid rgba(13,11,8,0.08)" }}>
      <div className="mb-1 flex items-center justify-between gap-3">
        <p className="font-sans text-[13.5px] font-semibold" style={{ color: "var(--noir)" }}>
          Paiements
        </p>
        {payments.length > 0 && (
          <span
            className="rounded-full px-2.5 py-1 font-sans text-[11.5px] font-semibold"
            style={remaining <= 0 ? { background: "rgba(76,154,106,0.12)", color: "#3B7D55" } : { background: "var(--blush)", color: "var(--rose-deep)" }}
          >
            {remaining <= 0 ? "Tout est payé" : `Reste ${chf(remaining)} / ${chf(total)}`}
          </span>
        )}
      </div>
      <p className="mb-2 font-sans text-[12px]" style={{ color: "rgba(13,11,8,0.5)" }}>
        Visible par le client sur son lien, avec les infos Twint pour l&apos;étape en cours.
      </p>

      {payments.length === 0 ? (
        <button
          type="button"
          onClick={() => run(() => createPaymentSchedule(quoteId))}
          disabled={isPending}
          className="mt-2 w-full rounded-xl px-4 py-3 font-sans text-[13px] font-medium disabled:opacity-60 sm:w-auto sm:py-2.5"
          style={{ background: "var(--rose-deep)", color: "var(--creme)" }}
        >
          {isPending ? "Création…" : "Créer l'échéancier (acompte + solde)"}
        </button>
      ) : (
        <>
          {payments.map((p) => (
            <PaymentRow key={`${p.id}-${p.status}-${p.amount}-${p.label}-${p.due_label}`} p={p} balanceTerms={balanceTerms} hasClientEmail={hasClientEmail} />
          ))}
          <button
            type="button"
            onClick={() => run(() => addPayment(quoteId))}
            disabled={isPending}
            className="mt-2 flex items-center gap-1.5 rounded-xl px-3 py-2 font-sans text-[12.5px] font-medium"
            style={{ border: "1px dashed rgba(13,11,8,0.2)", color: "rgba(13,11,8,0.6)" }}
          >
            <Plus size={13} /> Ajouter une étape
          </button>
        </>
      )}
    </div>
  );
}
