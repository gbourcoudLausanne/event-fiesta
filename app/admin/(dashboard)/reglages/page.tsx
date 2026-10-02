import { createClient } from "@/lib/supabase/server";
import { updateSettings } from "./actions";

const inputCls = "w-full rounded-xl bg-white px-3.5 py-2.5 font-sans text-[13.5px] outline-none";
const inputStyle = { border: "1px solid rgba(13,11,8,0.14)", color: "var(--noir)" } as const;
const labelCls = "mb-1 block font-sans text-[11px] uppercase tracking-[0.1em]";
const labelStyle = { color: "rgba(13,11,8,0.5)" };

export default async function ReglagesPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("settings")
    .select("creditor_name, creditor_address, creditor_zip, creditor_city, iban, twint_phone")
    .eq("id", true)
    .single();

  return (
    <div>
      <h1 className="mb-1 font-display text-[26px]" style={{ color: "var(--noir)" }}>
        Réglages
      </h1>
      <p className="mb-6 font-sans text-[13.5px]" style={{ color: "rgba(13,11,8,0.5)" }}>
        Coordonnées de paiement affichées sur les devis (virement et Twint).
      </p>

      <form
        action={updateSettings}
        className="grid grid-cols-2 gap-4 rounded-2xl bg-white p-5"
        style={{ border: "1px solid rgba(13,11,8,0.08)" }}
      >
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
          <input name="creditor_zip" defaultValue={settings?.creditor_zip ?? ""} className={inputCls} style={inputStyle} />
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
          <input name="twint_phone" defaultValue={settings?.twint_phone ?? ""} placeholder="+41 77 914 38 55" className={inputCls} style={inputStyle} />
        </div>

        <button
          type="submit"
          className="col-span-2 mt-1 justify-self-start rounded-xl px-5 py-2.5 font-sans text-[13px] font-medium"
          style={{ background: "var(--rose-deep)", color: "var(--creme)" }}
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}
