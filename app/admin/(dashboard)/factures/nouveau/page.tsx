import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import InvoiceForm from "../invoice-form";

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ client?: string }>;
}) {
  const { client } = await searchParams;
  if (!client) redirect("/admin/clients");

  const supabase = await createClient();
  const { data: clientRow } = await supabase
    .from("clients")
    .select("id, full_name")
    .eq("id", client)
    .single();

  if (!clientRow) redirect("/admin/clients");

  return (
    <div>
      <h1 className="mb-1 font-display text-[26px]" style={{ color: "var(--noir)" }}>
        Nouvelle facture
      </h1>
      <p className="mb-6 font-sans text-[13px]" style={{ color: "rgba(13,11,8,0.5)" }}>
        Client : {clientRow.full_name}
      </p>
      <InvoiceForm clientId={clientRow.id} />
    </div>
  );
}
