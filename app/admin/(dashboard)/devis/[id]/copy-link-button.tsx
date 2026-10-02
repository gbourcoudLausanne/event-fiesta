"use client";

import { useState } from "react";
import { Copy, Check } from "@phosphor-icons/react";

export default function CopyLinkButton({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* presse-papier indisponible — pas grave, le lien reste affiché */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-sans text-[13px] font-medium transition-colors hover:bg-black/5"
      style={{ border: "1px solid rgba(13,11,8,0.14)", color: "var(--noir)" }}
    >
      {copied ? <Check size={15} /> : <Copy size={15} />}
      {copied ? "Copié !" : "Copier le lien"}
    </button>
  );
}
