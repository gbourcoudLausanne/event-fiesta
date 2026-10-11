"use client";

import { useActionState, useState } from "react";
import { CheckCircle } from "@phosphor-icons/react";
import { updateSettings } from "./actions";

const inputCls = "w-full rounded-xl bg-white px-3.5 py-2.5 font-sans text-[13.5px] outline-none";
const inputStyle = { border: "1px solid rgba(13,11,8,0.14)", color: "var(--noir)" } as const;
const labelCls = "mb-1 block font-sans text-[11px] uppercase tracking-[0.1em]";
const labelStyle = { color: "rgba(13,11,8,0.5)" };

export type SettingsValues = {
  creditor_name: string | null;
  creditor_address: string | null;
  creditor_zip: string | null;
  creditor_city: string | null;
  iban: string | null;
  twint_phone: string | null;
  auto_reminders: boolean;
} | null;

export default function SettingsForm({ settings }: { settings: SettingsValues }) {
  const [justSaved, setJustSaved] = useState(false);
  const [state, formAction, isPending] = useActionState(
    async (prev: Awaited<ReturnType<typeof updateSettings>> | undefined, formData: FormData) => {
      const res = await updateSettings(prev, formData);
      if (res.ok) {
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 2200);
      }
      return res;
    },
    undefined,
  );

  return (
    <form
      action={formAction}
      className="grid grid-cols-2 gap-3 rounded-2xl bg-white p-4 md:gap-4 md:p-5"
      style={{ border: "1px solid rgba(13,11,8,0.08)" }}
    >
      {state?.error && (
        <div className="col-span-2 rounded-xl px-4 py-3 font-sans text-[13px]" style={{ background: "rgba(217,98,138,0.1)", color: "#B0546F" }}>
          {state.error}
        </div>
      )}
      <div className="col-span-2">
        <label className={labelCls} style={labelStyle}>Titulaire du compte</label>
        <input name="creditor_name" defaultValue={settings?.creditor_name ?? ""} placeholder="ex: Gilbert Bourcoud" className={inputCls} style={inputStyle} />
      </div>
      <div className="col-span-2">
        <label className={labelCls} style={labelStyle}>Adresse</label>
        <input name="creditor_address" defaultValue={settings?.creditor_address ?? ""} placeholder="Rue et numéro" className={inputCls} style={inputStyle} />
      </div>
      <div>
        <label className={labelCls} style={labelStyle}>NPA</label>
        <input name="creditor_zip" defaultValue={settings?.creditor_zip ?? ""} inputMode="numeric" className={inputCls} style={inputStyle} />
      </div>
      <div>
        <label className={labelCls} style={labelStyle}>Ville</label>
        <input name="creditor_city" defaultValue={settings?.creditor_city ?? ""} className={inputCls} style={inputStyle} />
      </div>
      <div className="col-span-2">
        <label className={labelCls} style={labelStyle}>IBAN</label>
        <input name="iban" defaultValue={settings?.iban ?? ""} placeholder="CH00 0000 0000 0000 0000 0" className={inputCls} style={inputStyle} />
      </div>
      <div className="col-span-2">
        <label className={labelCls} style={labelStyle}>Numéro Twint</label>
        <input name="twint_phone" type="tel" defaultValue={settings?.twint_phone ?? ""} placeholder="+41 77 914 38 55" className={inputCls} style={inputStyle} />
      </div>

      <div className="col-span-2 mt-2 rounded-xl p-3.5" style={{ background: "var(--creme-2)" }}>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            name="auto_reminders"
            defaultChecked={settings?.auto_reminders ?? true}
            className="mt-0.5 h-5 w-5 shrink-0 accent-[#B0546F]"
          />
          <span>
            <span className="block font-sans text-[13.5px] font-semibold" style={{ color: "var(--noir)" }}>
              Relances automatiques aux clients
            </span>
            <span className="block font-sans text-[12px] leading-relaxed" style={{ color: "rgba(13,11,8,0.55)" }}>
              Chaque matin, un e-mail part (une seule fois) : devis envoyé sans réponse depuis 7 jours, acompte pas payé
              48 h après la signature, solde pas payé la veille de l&apos;événement. Tu reçois un récapitulatif.
            </span>
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="col-span-2 mt-1 flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-sans text-[13px] font-medium transition-colors duration-300 disabled:opacity-60 sm:justify-self-start sm:py-2.5"
        style={{ background: justSaved ? "#4C9A6A" : "var(--rose-deep)", color: "var(--creme)" }}
      >
        {justSaved && <CheckCircle size={16} weight="fill" />}
        {justSaved ? "Enregistré" : isPending ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}
