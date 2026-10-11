"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SquaresFour,
  Users,
  FileText,
  Receipt,
  Gear,
  SignOut,
} from "@phosphor-icons/react";
import { logout } from "../actions";

const NAV = [
  { href: "/admin", label: "Vue d'ensemble", short: "Accueil", icon: SquaresFour, exact: true },
  { href: "/admin/clients", label: "Clients", short: "Clients", icon: Users },
  { href: "/admin/devis", label: "Devis", short: "Devis", icon: FileText },
  { href: "/admin/factures", label: "Factures", short: "Factures", icon: Receipt },
  { href: "/admin/reglages", label: "Réglages", short: "Réglages", icon: Gear },
];

export default function Sidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const isActive = (item: (typeof NAV)[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <>
      {/* Ordinateur : barre latérale fixe */}
      <aside
        className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col justify-between px-4 py-6 md:flex"
        style={{ background: "var(--noir)", color: "var(--creme)" }}
      >
        <div>
          <div className="mb-8 px-2">
            <p
              className="font-sans text-[10.5px] uppercase tracking-[0.2em]"
              style={{ color: "var(--or-light)" }}
            >
              Event Fiesta
            </p>
            <p className="font-display text-[19px]">Admin</p>
          </div>

          <nav className="flex flex-col gap-1">
            {NAV.map((item) => {
              const active = isActive(item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 font-sans text-[13.5px] transition-colors"
                  style={{
                    background: active ? "rgba(217,98,138,0.16)" : "transparent",
                    color: active ? "var(--rose-light)" : "rgba(250,247,242,0.7)",
                  }}
                >
                  <Icon size={17} weight={active ? "fill" : "regular"} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="px-2">
          <p
            className="mb-2 truncate font-sans text-[12px]"
            style={{ color: "rgba(250,247,242,0.45)" }}
          >
            {email}
          </p>
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 font-sans text-[13px] transition-colors hover:bg-white/5"
              style={{ color: "rgba(250,247,242,0.6)" }}
            >
              <SignOut size={16} />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile : barre du haut */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 md:hidden"
        style={{
          background: "var(--noir)",
          color: "var(--creme)",
          paddingTop: "max(0.75rem, env(safe-area-inset-top))",
        }}
      >
        <div className="flex items-baseline gap-2">
          <p
            className="font-sans text-[10px] uppercase tracking-[0.2em]"
            style={{ color: "var(--or-light)" }}
          >
            Event Fiesta
          </p>
          <p className="font-display text-[17px]">Admin</p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            aria-label="Déconnexion"
            className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors active:bg-white/10"
            style={{ color: "rgba(250,247,242,0.7)" }}
          >
            <SignOut size={19} />
          </button>
        </form>
      </header>

      {/* Mobile : onglets en bas */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 md:hidden"
        style={{
          background: "var(--noir)",
          paddingBottom: "env(safe-area-inset-bottom)",
          borderTop: "1px solid rgba(250,247,242,0.08)",
        }}
      >
        {NAV.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 pb-2 pt-2.5 font-sans text-[10.5px]"
              style={{ color: active ? "var(--rose-light)" : "rgba(250,247,242,0.6)" }}
            >
              <Icon size={22} weight={active ? "fill" : "regular"} />
              {item.short}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
