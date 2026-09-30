"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(login, undefined);

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: "var(--creme)" }}
    >
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <p
            className="mb-1 font-sans text-[11px] uppercase tracking-[0.2em]"
            style={{ color: "var(--or)" }}
          >
            Event Fiesta
          </p>
          <h1 className="font-display text-[28px]" style={{ color: "var(--noir)" }}>
            Espace admin
          </h1>
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          {state?.error && (
            <div
              className="rounded-xl px-4 py-3 font-sans text-[13px]"
              style={{ background: "rgba(217,98,138,0.1)", color: "#B0546F" }}
            >
              {state.error}
            </div>
          )}

          <label className="block">
            <span
              className="mb-1.5 block font-sans text-[11px] uppercase tracking-[0.14em]"
              style={{ color: "rgba(13,11,8,0.5)" }}
            >
              Email
            </span>
            <input
              name="email"
              type="email"
              required
              autoComplete="username"
              className="w-full rounded-xl bg-white px-4 py-3 font-sans text-[14px] outline-none"
              style={{ border: "1px solid rgba(13,11,8,0.14)", color: "var(--noir)" }}
            />
          </label>

          <label className="block">
            <span
              className="mb-1.5 block font-sans text-[11px] uppercase tracking-[0.14em]"
              style={{ color: "rgba(13,11,8,0.5)" }}
            >
              Mot de passe
            </span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
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
            {isPending ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
