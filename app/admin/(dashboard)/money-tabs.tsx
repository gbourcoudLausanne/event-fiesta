import Link from "next/link";

// Onglets en haut de Paiements / Factures (même rubrique dans la navigation).
export default function MoneyTabs({ active }: { active: "paiements" | "factures" }) {
  const tab = (key: "paiements" | "factures", href: string, label: string) => (
    <Link
      href={href}
      className="flex-1 rounded-lg px-4 py-2 text-center font-sans text-[13px] font-medium transition-colors sm:flex-none"
      style={active === key ? { background: "#fff", color: "var(--noir)", boxShadow: "0 1px 3px rgba(13,11,8,0.08)" } : { color: "rgba(13,11,8,0.55)" }}
    >
      {label}
    </Link>
  );
  return (
    <div className="mb-5 flex gap-1 rounded-xl p-1 sm:inline-flex" style={{ background: "var(--creme-2)" }}>
      {tab("paiements", "/admin/paiements", "Suivi des paiements")}
      {tab("factures", "/admin/factures", "Factures")}
    </div>
  );
}
