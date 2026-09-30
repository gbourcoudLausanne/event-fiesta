"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateQuoteStatus, deleteQuote } from "../actions";
import { Trash } from "@phosphor-icons/react";

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

  function handleDelete() {
    startTransition(async () => {
      await deleteQuote(quoteId, clientId);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
        disabled={isPending}
        className="rounded-xl bg-white px-3 py-2 font-sans text-[13px] outline-none"
        style={{ border: "1px solid rgba(13,11,8,0.14)", color: "var(--noir)" }}
      >
        {STATUS_ORDER.map((s) => (
          <option key={s} value={s}>{labels[s]}</option>
        ))}
      </select>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors hover:bg-black/5"
        style={{ color: "rgba(13,11,8,0.4)" }}
        title="Supprimer"
      >
        <Trash size={15} />
      </button>
    </div>
  );
}
