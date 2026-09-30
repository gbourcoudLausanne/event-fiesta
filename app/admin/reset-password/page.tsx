"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  // Le lien de récupération livre les jetons dans le fragment #access_token=…
  // (format "implicit"), pas dans un ?code= — le client navigateur étant
  // configuré en PKCE par défaut, sa détection automatique ne les reconnaît
  // pas. On les extrait donc nous-mêmes pour établir la session.
  useEffect(() => {
    async function establishSession() {
      const hash = window.location.hash.replace(/^#/, "");
      const params = new URLSearchParams(hash);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (!access_token || !refresh_token) {
        return "Le lien de récupération n'a pas pu être validé — demande un nouveau lien.";
      }

      const { error: setErr } = await supabase.auth.setSession({ access_token, refresh_token });
      if (setErr) {
        return "Le lien de récupération a peut-être expiré — demande un nouveau lien.";
      }

      // Retire les jetons de l'URL visible une fois la session établie.
      window.history.replaceState(null, "", window.location.pathname);
      return null;
    }

    establishSession().then((errorMessage) => {
      if (errorMessage) setError(errorMessage);
      else setSessionReady(true);
    });
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Le mot de passe doit faire au moins 8 caractères.");
      return;
    }
    setIsPending(true);
    setError(null);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError("Impossible de mettre à jour le mot de passe.");
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
              disabled={!sessionReady}
              className="w-full rounded-xl bg-white px-4 py-3 font-sans text-[14px] outline-none disabled:opacity-50"
              style={{ border: "1px solid rgba(13,11,8,0.14)", color: "var(--noir)" }}
            />
          </label>

          <button
            type="submit"
            disabled={isPending || !sessionReady}
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
