import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createClientRecord, deleteClientRecord } from "./actions";
import { Trash } from "@phosphor-icons/react/dist/ssr";

const inputCls =
  "w-full rounded-xl bg-white px-3.5 py-2.5 font-sans text-[13.5px] outline-none";
const inputStyle = { border: "1px solid rgba(13,11,8,0.14)", color: "var(--noir)" } as const;

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("id, full_name, email, phone, address, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-6 font-display text-[26px]" style={{ color: "var(--noir)" }}>
        Clients
      </h1>

      <form
        action={createClientRecord}
        className="mb-8 grid grid-cols-4 gap-3 rounded-2xl bg-white p-5"
        style={{ border: "1px solid rgba(13,11,8,0.08)" }}
      >
        <input name="full_name" placeholder="Nom complet *" required className={inputCls} style={inputStyle} />
        <input name="email" type="email" placeholder="Email" className={inputCls} style={inputStyle} />
        <input name="phone" placeholder="Téléphone" className={inputCls} style={inputStyle} />
        <input name="address" placeholder="Adresse" className={inputCls} style={inputStyle} />
        <button
          type="submit"
          className="col-span-4 mt-1 justify-self-start rounded-xl px-5 py-2.5 font-sans text-[13px] font-medium"
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
              className="flex items-center justify-between px-5 py-1"
              style={{ borderTop: i > 0 ? "1px solid rgba(13,11,8,0.06)" : undefined }}
            >
              <Link href={`/admin/clients/${c.id}`} className="flex-1 py-3 transition-opacity hover:opacity-70">
                <p className="font-sans text-[14px] font-semibold" style={{ color: "var(--noir)" }}>
                  {c.full_name}
                </p>
                <p className="font-sans text-[12.5px]" style={{ color: "rgba(13,11,8,0.5)" }}>
                  {[c.email, c.phone, c.address].filter(Boolean).join(" · ") || "—"}
                </p>
              </Link>
              <form action={deleteClientRecord.bind(null, c.id)}>
                <button
                  type="submit"
                  className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-black/5"
                  style={{ color: "rgba(13,11,8,0.35)" }}
                  title="Supprimer"
                >
                  <Trash size={15} />
                </button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
