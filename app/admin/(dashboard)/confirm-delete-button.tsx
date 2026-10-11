"use client";

import { useEffect, useState, useTransition } from "react";
import { Trash } from "@phosphor-icons/react";

export default function ConfirmDeleteButton({
  onConfirm,
  title,
  message,
  className = "flex h-9 w-9 items-center justify-center rounded-xl transition-colors hover:bg-black/5",
  iconSize = 15,
}: {
  onConfirm: () => Promise<void> | void;
  title: string;
  message?: string;
  className?: string;
  iconSize?: number;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isPending) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, isPending]);

  function confirm() {
    startTransition(async () => {
      await onConfirm();
      setOpen(false);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
        style={{ color: "rgba(13,11,8,0.4)" }}
        title="Supprimer"
        aria-label="Supprimer"
      >
        <Trash size={iconSize} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-6"
          style={{ background: "rgba(13,11,8,0.45)" }}
          onClick={() => !isPending && setOpen(false)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-delete-title"
            className="w-full max-w-sm rounded-2xl bg-white p-5"
            style={{ marginBottom: "env(safe-area-inset-bottom)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="mb-3 flex h-10 w-10 items-center justify-center rounded-full"
              style={{ background: "rgba(217,98,138,0.12)", color: "#B0546F" }}
            >
              <Trash size={19} />
            </div>
            <p id="confirm-delete-title" className="mb-1 font-sans text-[15px] font-semibold" style={{ color: "var(--noir)" }}>
              {title}
            </p>
            <p className="mb-5 font-sans text-[13px] leading-relaxed" style={{ color: "rgba(13,11,8,0.55)" }}>
              {message ?? "Cette action est définitive."}
            </p>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={isPending}
                autoFocus
                className="rounded-xl px-4 py-3 font-sans text-[13.5px] font-medium transition-colors hover:bg-black/5 disabled:opacity-60 sm:py-2.5"
                style={{ border: "1px solid rgba(13,11,8,0.14)", color: "var(--noir)" }}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirm}
                disabled={isPending}
                className="rounded-xl px-4 py-3 font-sans text-[13.5px] font-medium disabled:opacity-60 sm:py-2.5"
                style={{ background: "#B0546F", color: "var(--creme)" }}
              >
                {isPending ? "Suppression…" : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
