import { createClient } from "@/lib/supabase/server";
import SettingsForm from "./settings-form";
import PushSettings from "./push-settings";

export default async function ReglagesPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("settings")
    .select("creditor_name, creditor_address, creditor_zip, creditor_city, iban, twint_phone, auto_reminders")
    .eq("id", true)
    .single();

  return (
    <div>
      <h1 className="mb-1 font-display text-[23px] md:text-[26px]" style={{ color: "var(--noir)" }}>
        Réglages
      </h1>
      <p className="mb-6 font-sans text-[13.5px]" style={{ color: "rgba(13,11,8,0.5)" }}>
        Coordonnées de paiement affichées sur les devis (virement et Twint).
      </p>
      <SettingsForm settings={settings} />
      <PushSettings />
    </div>
  );
}
