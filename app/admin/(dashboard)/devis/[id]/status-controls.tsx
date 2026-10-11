"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateQuoteStatus, deleteQuote } from "../actions";
import ConfirmDeleteButton from "../../confirm-delete-button";

const STATUS_ORDER = ["brouillon", "envoye", "accepte", "refuse"];

export default function StatusControls({
  quoteId,
  clientId,
  status,
  labels,
}: {
  quoteId: string;
  clientId: string;
  status: string;
  labels: Record<string, string>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(next: string) {
    startTransition(async () => {
      await updateQuoteStatus(quoteId, next);
      router.refresh();
    });
  }

  async function handleDelete() {
    await deleteQuote(quoteId, clientId);
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
        disabled={isPending}
        className="rounded-xl bg-white px-3 py-2 font-sans text-[13px] outline-none max-md:py-1.5"
        style={{ border: "1px solid rgba(13,11,8,0.14)", color: "var(--noir)" }}
      >
        {STATUS_ORDER.map((s) => (
          <option key={s} value={s}>{labels[s]}</option>
        ))}
      </select>
      <ConfirmDeleteButton
        onConfirm={handleDelete}
        title="Supprimer ce devis ?"
        message="Le devis, sa signature, ses images et son suivi des paiements (y compris les paiements déjà encaissés) seront définitivement supprimés, et le lien client ne fonctionnera plus. Les factures liées sont conservées. Pour un devis abandonné, préfère le statut « Refusé »."
      />
    </div>
  );
}
