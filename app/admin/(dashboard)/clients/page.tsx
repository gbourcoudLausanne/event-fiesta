import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createClientRecord, deleteClientRecord } from "./actions";
import ConfirmDeleteButton from "../confirm-delete-button";

const inputCls =
  "w-full rounded-xl bg-white px-3.5 py-2.5 font-sans text-[13.5px] outline-none";
const inputStyle = { border: "1px solid rgba(13,11,8,0.14)", color: "var(--noir)" } as const;

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("id, full_name, email, phone, address, source, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-6 font-display text-[23px] md:text-[26px]" style={{ color: "var(--noir)" }}>
        Clients
      </h1>

      <form
        action={createClientRecord}
        className="mb-6 grid grid-cols-1 gap-3 rounded-2xl bg-white p-4 sm:grid-cols-2 md:mb-8 md:p-5 lg:grid-cols-4"
        style={{ border: "1px solid rgba(13,11,8,0.08)" }}
      >
        <input name="full_name" placeholder="Nom complet *" required className={inputCls} style={inputStyle} />
        <input name="email" type="email" placeholder="Email" className={inputCls} style={inputStyle} />
        <input name="phone" type="tel" placeholder="Téléphone" className={inputCls} style={inputStyle} />
        <input name="address" placeholder="Adresse" className={inputCls} style={inputStyle} />
        <button
          type="submit"
          className="col-span-full mt-1 rounded-xl px-5 py-3 font-sans text-[13px] font-medium sm:justify-self-start sm:py-2.5"
          style={{ background: "var(--rose-deep)", color: "var(--creme)" }}
        >
          Ajouter le client
        </button>
      </form>

      <div className="rounded-2xl bg-white" style={{ border: "1px solid rgba(13,11,8,0.08)" }}>
        {!clients || clients.length === 0 ? (
          <p className="px-5 py-8 text-center font-sans text-[13.5px]" style={{ color: "rgba(13,11,8,0.4)" }}>
            Aucun client pour l&apos;instant.
          </p>
        ) : (
          clients.map((c, i) => (
            <div
              key={c.id}
              className="flex items-center justify-between gap-2 py-1 pl-4 pr-2 md:px-5"
              style={{ borderTop: i > 0 ? "1px solid rgba(13,11,8,0.06)" : undefined }}
            >
              <Link href={`/admin/clients/${c.id}`} className="min-w-0 flex-1 py-3 transition-opacity hover:opacity-70">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="font-sans text-[14px] font-semibold" style={{ color: "var(--noir)" }}>
                    {c.full_name}
                  </p>
                  {c.source === "site_web" && (
                    <span
                      className="rounded-full px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wide"
                      style={{ background: "var(--blush)", color: "var(--rose-deep)" }}
                    >
                      Nouvelle demande
                    </span>
                  )}
                </div>
                <p className="truncate font-sans text-[12.5px]" style={{ color: "rgba(13,11,8,0.5)" }}>
                  {[c.email, c.phone, c.address].filter(Boolean).join(" · ") || "—"}
                </p>
              </Link>
              <ConfirmDeleteButton
                onConfirm={deleteClientRecord.bind(null, c.id)}
                title={`Supprimer ${c.full_name} ?`}
                message="La fiche client sera définitivement supprimée. Ses devis et factures sont conservés, mais ne seront plus rattachés à un client."
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-black/5 md:h-8 md:w-8"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
