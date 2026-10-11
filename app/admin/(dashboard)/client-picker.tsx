"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlass, CaretRight, UserPlus, Users } from "@phosphor-icons/react";
import { createClientFromPicker } from "./clients/actions";

const inputCls = "w-full rounded-xl bg-white px-3.5 py-2.5 font-sans text-[13.5px] outline-none";
const inputStyle = { border: "1px solid rgba(13,11,8,0.14)", color: "var(--noir)" } as const;
const labelCls = "mb-1 block font-sans text-[11px] uppercase tracking-[0.1em]";
const labelStyle = { color: "rgba(13,11,8,0.5)" };

type ClientRow = { id: string; full_name: string; email: string | null; phone: string | null };

function normalize(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// `nextPath` : page de création à ouvrir avec ?client=<id> (devis ou facture).
export default function ClientPicker({ clients, nextPath, docLabel }: { clients: ClientRow[]; nextPath: string; docLabel: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<"existant" | "nouveau">(clients.length > 0 ? "existant" : "nouveau");
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", address: "" });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return clients;
    return clients.filter((c) =>
      [c.full_name, c.email, c.phone].some((v) => v && normalize(v).includes(q)),
    );
  }, [clients, query]);

  function pick(id: string) {
    router.push(`${nextPath}?client=${id}`);
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await createClientFromPicker(form);
      if (res.error || !res.id) {
        setError(res.error ?? "Impossible de créer le client.");
        return;
      }
      pick(res.id);
    });
  }

  const tabBtn = (active: boolean) => ({
    background: active ? "var(--rose-deep)" : "transparent",
    color: active ? "var(--creme)" : "rgba(13,11,8,0.6)",
    border: active ? "1px solid var(--rose-deep)" : "1px solid rgba(13,11,8,0.14)",
  });

  return (
    <div className="rounded-2xl bg-white p-4 md:p-5" style={{ border: "1px solid rgba(13,11,8,0.08)" }}>
      <p className="mb-3 font-sans text-[13px] font-semibold" style={{ color: "var(--noir)" }}>
        Pour quel client ?
      </p>

      <div className="mb-4 grid grid-cols-2 gap-1.5 sm:inline-grid sm:w-auto">
        <button
          type="button"
          onClick={() => setMode("existant")}
          className="flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 font-sans text-[12.5px] font-medium sm:py-2"
          style={tabBtn(mode === "existant")}
        >
          <Users size={15} /> Client existant
        </button>
        <button
          type="button"
          onClick={() => setMode("nouveau")}
          className="flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 font-sans text-[12.5px] font-medium sm:py-2"
          style={tabBtn(mode === "nouveau")}
        >
          <UserPlus size={15} /> Nouveau client
        </button>
      </div>

      {mode === "existant" ? (
        <>
          <div className="relative mb-3">
            <MagnifyingGlass
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "rgba(13,11,8,0.35)" }}
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher par nom, email ou téléphone…"
              className={inputCls + " pl-9"}
              style={inputStyle}
            />
          </div>
          <div className="overflow-hidden rounded-xl" style={{ border: "1px solid rgba(13,11,8,0.08)" }}>
            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <p className="mb-2 font-sans text-[13px]" style={{ color: "rgba(13,11,8,0.45)" }}>
                  {clients.length === 0 ? "Aucun client dans le CRM." : "Aucun client trouvé."}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setForm((f) => ({ ...f, full_name: query.trim() }));
                    setMode("nouveau");
                  }}
                  className="font-sans text-[13px] font-medium underline"
                  style={{ color: "var(--rose-deep)" }}
                >
                  Créer {query.trim() ? `« ${query.trim()} »` : "un nouveau client"}
                </button>
              </div>
            ) : (
              <div className="max-h-[50vh] overflow-y-auto">
                {filtered.map((c, i) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => pick(c.id)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-black/[0.02] active:bg-black/[0.04]"
                    style={{ borderTop: i > 0 ? "1px solid rgba(13,11,8,0.06)" : undefined }}
                  >
                    <div className="min-w-0">
                      <p className="truncate font-sans text-[14px] font-semibold" style={{ color: "var(--noir)" }}>
                        {c.full_name}
                      </p>
                      <p className="truncate font-sans text-[12px]" style={{ color: "rgba(13,11,8,0.5)" }}>
                        {[c.email, c.phone].filter(Boolean).join(" · ") || "—"}
                      </p>
                    </div>
                    <CaretRight size={15} className="shrink-0" style={{ color: "rgba(13,11,8,0.35)" }} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <form onSubmit={handleCreate} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {error && (
            <div className="rounded-xl px-4 py-3 font-sans text-[13px] sm:col-span-2" style={{ background: "rgba(217,98,138,0.1)", color: "#B0546F" }}>
              {error}
            </div>
          )}
          <div className="sm:col-span-2">
            <label className={labelCls} style={labelStyle}>Nom complet *</label>
            <input
              required
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className={inputCls}
              style={inputStyle}
            />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputCls}
              style={inputStyle}
            />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Téléphone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={inputCls}
              style={inputStyle}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls} style={labelStyle}>Adresse</label>
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className={inputCls}
              style={inputStyle}
            />
          </div>
          <p className="font-sans text-[12px] sm:col-span-2" style={{ color: "rgba(13,11,8,0.5)" }}>
            Le client est enregistré dans le CRM, puis tu passes directement {docLabel}.
          </p>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl px-5 py-3 font-sans text-[13.5px] font-medium disabled:opacity-60 sm:col-span-2 sm:justify-self-start sm:py-2.5"
            style={{ background: "var(--rose-deep)", color: "var(--creme)" }}
          >
            {isPending ? "Création…" : "Créer le client et continuer"}
          </button>
        </form>
      )}
    </div>
  );
}
