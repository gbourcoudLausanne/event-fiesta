"use client";

import { useEffect, useRef, useState } from "react";
import SignaturePad from "signature_pad";
import { signQuote } from "./actions";
import { DEVIS_I18N, type DevisLang } from "@/lib/devis-i18n";

export default function SignaturePadClient({ token, lang = "fr" }: { token: string; lang?: DevisLang }) {
  const t = DEVIS_I18N[lang];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePad | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resize() {
      if (!canvas) return;
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext("2d")?.scale(ratio, ratio);
      padRef.current?.clear();
    }

    padRef.current = new SignaturePad(canvas, { penColor: "#0D0B08" });
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  function clearSignature() {
    padRef.current?.clear();
    setError(null);
  }

  async function handleSubmit() {
    setError(null);
    if (!name.trim()) {
      setError(t.errorName);
      return;
    }
    if (!padRef.current || padRef.current.isEmpty()) {
      setError(t.errorSignature);
      return;
    }
    setIsPending(true);
    const signatureDataUrl = padRef.current.toDataURL("image/png");
    const res = await signQuote(token, { signerName: name, signatureDataUrl });
    if (res.error) {
      setError(res.error);
      setIsPending(false);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-2xl p-6 text-center" style={{ background: "var(--blush)" }}>
        <p className="font-display text-[20px]" style={{ color: "var(--noir)" }}>
          {t.thanksName(name)}
        </p>
        <p className="mt-1 font-sans text-[13px]" style={{ color: "rgba(13,11,8,0.6)" }}>
          {t.thanksBody}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6" style={{ border: "1px solid rgba(13,11,8,0.1)" }}>
      <p className="mb-1 font-display text-[19px]" style={{ color: "var(--noir)" }}>
        {t.bonCommandeTitle}
      </p>
      <p className="mb-4 font-sans text-[12.5px]" style={{ color: "rgba(13,11,8,0.55)" }}>
        {t.bonCommandeSubtitle}
      </p>

      {error && (
        <div className="mb-3 rounded-xl px-4 py-2.5 font-sans text-[13px]" style={{ background: "rgba(217,98,138,0.1)", color: "#B0546F" }}>
          {error}
        </div>
      )}

      <label className="mb-3 block">
        <span className="mb-1.5 block font-sans text-[11px] uppercase tracking-[0.1em]" style={{ color: "rgba(13,11,8,0.5)" }}>
          {t.yourName}
        </span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.namePlaceholder}
          className="w-full rounded-xl bg-white px-3.5 py-2.5 font-sans text-[13.5px] outline-none"
          style={{ border: "1px solid rgba(13,11,8,0.14)", color: "var(--noir)" }}
        />
      </label>

      <span className="mb-1.5 block font-sans text-[11px] uppercase tracking-[0.1em]" style={{ color: "rgba(13,11,8,0.5)" }}>
        {t.signatureLabel}
      </span>
      <canvas
        ref={canvasRef}
        className="h-40 w-full rounded-xl"
        style={{ border: "1px dashed rgba(13,11,8,0.25)", touchAction: "none" }}
      />

      <div className="mt-3 flex items-center justify-between">
        <button type="button" onClick={clearSignature} className="font-sans text-[12px]" style={{ color: "rgba(13,11,8,0.45)" }}>
          {t.clear}
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="rounded-2xl px-6 py-3 font-sans text-[13.5px] font-medium disabled:opacity-60"
          style={{ background: "var(--rose-deep)", color: "var(--creme)" }}
        >
          {isPending ? t.sending : t.accept}
        </button>
      </div>
    </div>
  );
}
