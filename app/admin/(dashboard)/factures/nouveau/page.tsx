import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import InvoiceForm from "../invoice-form";
import ClientPicker from "../../client-picker";

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ client?: string }>;
}) {
  const { client } = await searchParams;
  const supabase = await createClient();

  const clientRow = client
    ? (await supabase.from("clients").select("id, full_name").eq("id", client).single()).data
    : null;

  // Étape 1 : choisir un client existant ou en créer un nouveau
  if (!clientRow) {
    const { data: clients } = await supabase
      .from("clients")
      .select("id, full_name, email, phone")
      .order("full_name", { ascending: true });

    return (
      <div>
        <Link href="/admin/factures" className="mb-4 inline-block font-sans text-[12.5px]" style={{ color: "rgba(13,11,8,0.5)" }}>
          ← Factures
        </Link>
        <h1 className="mb-5 font-display text-[23px] md:mb-6 md:text-[26px]" style={{ color: "var(--noir)" }}>
          Nouvelle facture
        </h1>
        <ClientPicker clients={clients ?? []} nextPath="/admin/factures/nouveau" docLabel="à la facture" />
      </div>
    );
  }

  // Étape 2 : la facture
  return (
    <div>
      <h1 className="mb-1 font-display text-[23px] md:text-[26px]" style={{ color: "var(--noir)" }}>
        Nouvelle facture
      </h1>
      <p className="mb-6 font-sans text-[13px]" style={{ color: "rgba(13,11,8,0.5)" }}>
        Client : {clientRow.full_name} ·{" "}
        <Link href="/admin/factures/nouveau" className="underline" style={{ color: "var(--rose-deep)" }}>
          changer
        </Link>
      </p>
      <InvoiceForm clientId={clientRow.id} />
    </div>
  );
}
