"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Le mot de passe doit faire au moins 8 caractères.");
      return;
    }
    setIsPending(true);
    setError(null);

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError("Impossible de mettre à jour le mot de passe — le lien a peut-être expiré.");
      setIsPending(false);
      return;
    }

    router.push("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: "var(--creme)" }}>
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="mb-1 font-sans text-[11px] uppercase tracking-[0.2em]" style={{ color: "var(--or)" }}>
            Event Fiesta
          </p>
          <h1 className="font-display text-[26px]" style={{ color: "var(--noir)" }}>
            Choisir un mot de passe
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div
              className="rounded-xl px-4 py-3 font-sans text-[13px]"
              style={{ background: "rgba(217,98,138,0.1)", color: "#B0546F" }}
            >
              {error}
            </div>
          )}

          <label className="block">
            <span className="mb-1.5 block font-sans text-[11px] uppercase tracking-[0.14em]" style={{ color: "rgba(13,11,8,0.5)" }}>
              Nouveau mot de passe
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full rounded-xl bg-white px-4 py-3 font-sans text-[14px] outline-none"
              style={{ border: "1px solid rgba(13,11,8,0.14)", color: "var(--noir)" }}
            />
          </label>

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 rounded-2xl py-3.5 font-sans text-[14px] font-medium disabled:opacity-60"
            style={{ background: "var(--rose-deep)", color: "var(--creme)" }}
          >
            {isPending ? "Enregistrement…" : "Définir le mot de passe"}
          </button>
        </form>
      </div>
    </div>
  );
}
