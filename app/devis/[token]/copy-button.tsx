"use client";

import { useState } from "react";

export default function CopyButton({ value, label, copiedLabel }: { value: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          /* presse-papier indisponible : la valeur reste affichée */
        }
      }}
      className="shrink-0 rounded-lg px-3 py-1.5 font-sans text-[12px] font-medium"
      style={{ background: copied ? "#4C9A6A" : "var(--rose-deep)", color: "var(--creme)" }}
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
