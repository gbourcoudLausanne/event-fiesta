"use client";

import { useState, useTransition } from "react";
import { translateQuote, resetQuoteTranslation } from "../translation-actions";

const LANGS: { code: "fr" | "es" | "en"; label: string }[] = [
  { code: "fr", label: "FR" },
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
];

export default function LanguageControls({
  quoteId,
  clientLanguage,
}: {
  quoteId: string;
  clientLanguage: string | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [pendingLang, setPendingLang] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function translate(lang: "fr" | "es" | "en") {
    setError(null);
    setPendingLang(lang);
    startTransition(async () => {
      const res = await translateQuote(quoteId, lang);
      if (res?.error) setError(res.error);
      setPendingLang(null);
    });
  }

  function reset() {
    setError(null);
    startTransition(async () => {
      await resetQuoteTranslation(quoteId);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-sans text-[11px] uppercase tracking-[0.1em]" style={{ color: "rgba(13,11,8,0.45)" }}>
        Langue client
      </span>
      <div className="flex gap-1">
        {LANGS.map((l) => {
          const active = clientLanguage === l.code;
          return (
            <button
              key={l.code}
              type="button"
              onClick={() => translate(l.code)}
              disabled={isPending}
              className="rounded-lg px-2.5 py-1.5 font-sans text-[12px] font-medium disabled:opacity-60"
              style={{
                background: active ? "var(--rose-deep)" : "transparent",
                color: active ? "var(--creme)" : "rgba(13,11,8,0.6)",
                border: active ? "1px solid var(--rose-deep)" : "1px solid rgba(13,11,8,0.14)",
              }}
            >
              {isPending && pendingLang === l.code ? "…" : l.label}
            </button>
          );
        })}
        {clientLanguage && (
          <button
            type="button"
            onClick={reset}
            disabled={isPending}
            className="rounded-lg px-2.5 py-1.5 font-sans text-[12px] underline"
            style={{ color: "rgba(13,11,8,0.4)" }}
          >
            Original
          </button>
        )}
      </div>
      {error && (
        <span className="font-sans text-[11.5px]" style={{ color: "#B0546F" }}>
          {error}
        </span>
      )}
    </div>
  );
}
