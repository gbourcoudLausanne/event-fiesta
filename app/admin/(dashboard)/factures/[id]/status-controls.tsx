"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateInvoiceStatus, deleteInvoice } from "../actions";
import ConfirmDeleteButton from "../../confirm-delete-button";

const STATUS_ORDER = ["en_attente", "payee", "annulee"];

export default function StatusControls({
  invoiceId,
  clientId,
  status,
  labels,
}: {
  invoiceId: string;
  clientId: string;
  status: string;
  labels: Record<string, string>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(next: string) {
    startTransition(async () => {
      await updateInvoiceStatus(invoiceId, next);
      router.refresh();
    });
  }

  async function handleDelete() {
    await deleteInvoice(invoiceId, clientId);
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
        title="Supprimer cette facture ?"
        message="La facture sera définitivement supprimée."
      />
    </div>
  );
}
