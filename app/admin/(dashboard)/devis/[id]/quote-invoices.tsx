"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Receipt, Plus } from "@phosphor-icons/react";
import { createInvoiceFromQuote } from "../../factures/actions";

const STATUS: Record<string, { label: string; style: React.CSSProperties }> = {
  en_attente: { label: "En attente", style: { background: "var(--blush)", color: "var(--rose-deep)" } },
  payee: { label: "Payée", style: { background: "rgba(76,154,106,0.12)", color: "#3B7D55" } },
  annulee: { label: "Annulée", style: { background: "var(--creme-2)", color: "rgba(13,11,8,0.5)" } },
};

export default function QuoteInvoices({
  quoteId,
  invoices,
}: {
  quoteId: string;
  invoices: { id: string; reference: string; status: string; created_at: string }[];
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="mb-6 rounded-2xl bg-white p-4 md:p-5" style={{ border: "1px solid rgba(13,11,8,0.08)" }}>
      <div className="mb-1 flex items-center justify-between gap-3">
        <p className="flex items-center gap-1.5 font-sans text-[13.5px] font-semibold" style={{ color: "var(--noir)" }}>
          <Receipt size={16} /> Facture
        </p>
        <button
          type="button"
          disabled={isPending}
          onClick={() => startTransition(async () => void (await createInvoiceFromQuote(quoteId)))}
          className="flex items-center gap-1 rounded-xl px-3 py-2 font-sans text-[12.5px] font-medium disabled:opacity-60"
          style={{ border: "1px solid rgba(13,11,8,0.14)", color: "var(--noir)" }}
        >
          <Plus size={13} /> {isPending ? "Création…" : "Créer une facture"}
        </button>
      </div>
      <p className="font-sans text-[12px]" style={{ color: "rgba(13,11,8,0.5)" }}>
        Facture classique au besoin (entreprise, comptabilité) : pré-remplie depuis ce devis, acompte déjà reçu déduit.
      </p>
      {invoices.length > 0 && (
        <div className="mt-3">
          {invoices.map((inv, i) => (
            <Link
              key={inv.id}
              href={`/admin/factures/${inv.id}`}
              className="flex items-center justify-between gap-3 py-2.5"
              style={{ borderTop: i > 0 ? "1px solid rgba(13,11,8,0.06)" : "1px solid rgba(13,11,8,0.06)" }}
            >
              <span className="font-sans text-[13.5px] font-medium" style={{ color: "var(--noir)" }}>
                {inv.reference}
                <span className="ml-2 font-sans text-[12px] font-normal" style={{ color: "rgba(13,11,8,0.45)" }}>
                  {new Date(inv.created_at).toLocaleDateString("fr-CH", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </span>
              <span className="rounded-full px-2.5 py-1 font-sans text-[11px] font-semibold" style={(STATUS[inv.status] ?? STATUS.en_attente).style}>
                {(STATUS[inv.status] ?? STATUS.en_attente).label}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
