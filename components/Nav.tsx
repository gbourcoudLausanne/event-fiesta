"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { useI18n, type Lang } from "@/lib/i18n";

export function Nav() {
  const { t, lang, setLang } = useI18n();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const reduce = useReducedMotion();

  const langs: Lang[] = ["fr", "es", "en"];

  const navLinks = [
    { label: t.nav.home, href: "/" },
    { label: t.nav.about, href: "/a-propos" },
    { label: t.nav.services, href: "/nos-services" },
    { label: t.nav.gallery, href: "/galerie" },
    { label: t.nav.contact, href: "/contact" },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40"
      style={{
        background: "#FAF7F2",
        borderBottom: "1px solid rgba(217,98,138,0.14)",
        boxShadow: "0 6px 24px rgba(13,11,8,0.06)",
      }}
    >
      {/* Gold accent line bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, rgba(217,98,138,0.35) 0%, rgba(244,168,184,0.5) 50%, rgba(217,98,138,0.15) 100%)",
        }}
        aria-hidden
      />

      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-[68px] flex items-center justify-between gap-6">

        {/* Logo */}
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-2.5 shrink-0 cursor-pointer group"
          aria-label="Event Fiesta — Accueil"
        >
          {/* Ballon doré SVG */}
          <svg
            width="18"
            height="30"
            viewBox="0 0 18 30"
            fill="none"
            className="transition-transform duration-500 group-hover:-translate-y-1.5"
            aria-hidden
          >
            <defs>
              <linearGradient id="ballonGold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F2879E" />
                <stop offset="100%" stopColor="#C24B72" />
              </linearGradient>
            </defs>
            {/* Corps */}
            <ellipse cx="9" cy="9" rx="7.8" ry="8.6" fill="url(#ballonGold)" />
            {/* Reflet */}
            <ellipse cx="5.8" cy="5.5" rx="2" ry="2.8" fill="white" opacity="0.28" transform="rotate(-18 5.8 5.5)" />
            {/* Nœud */}
            <path d="M7.4 17.6 Q9 20.2 10.6 17.6" stroke="url(#ballonGold)" strokeWidth="1.1" fill="url(#ballonGold)" strokeLinecap="round" />
            {/* Ficelle */}
            <path d="M9 20.5 Q7.5 24 9 27.5 Q10 29.5 9 30" stroke="#C24B72" strokeWidth="0.65" strokeLinecap="round" fill="none" opacity="0.5" />
          </svg>

          {/* Texte */}
          <div className="flex flex-col items-start">
            <div className="flex items-baseline gap-1.5">
              <span
                className="font-sans font-medium text-[1.05rem] tracking-[0.14em] uppercase leading-none"
                style={{ color: "#0D0B08" }}
              >
                Event
              </span>
              <span
                className="font-serif italic font-light text-[1.35rem] leading-[1.1] transition-all duration-300 group-hover:tracking-wide"
                style={{ color: "#F4A8B8" }}
              >
                Fiesta
              </span>
            </div>
            <span
              className="font-sans text-[7.5px] tracking-[0.22em] uppercase mt-0.5"
              style={{ color: "rgba(13,11,8,0.4)" }}
            >
              Décoration sur mesure
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-9 flex-1 justify-center">
          {navLinks.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className="nav-link font-sans text-[13px] font-light tracking-wide cursor-pointer transition-colors duration-200 pb-0.5"
                style={{ color: isActive(href) ? "#0D0B08" : "rgba(13,11,8,0.55)" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "#0D0B08")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = isActive(href)
                    ? "#0D0B08"
                    : "rgba(13,11,8,0.55)")
                }
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right: language + CTA */}
        <div className="hidden lg:flex items-center gap-5 shrink-0">
          <div className="flex items-center gap-1">
            {langs.map((l, i) => (
              <span key={l} className="flex items-center gap-1">
                {i > 0 && (
                  <span style={{ color: "rgba(13,11,8,0.2)", fontSize: 10 }}>·</span>
                )}
                <button
                  onClick={() => setLang(l)}
                  className="font-sans text-[11px] uppercase tracking-widest cursor-pointer transition-all duration-200 px-1 py-0.5 rounded"
                  style={{
                    color: lang === l ? "#F4A8B8" : "rgba(13,11,8,0.35)",
                    fontWeight: lang === l ? 600 : 300,
                  }}
                  aria-label={`Langue ${l.toUpperCase()}`}
                  aria-pressed={lang === l}
                >
                  {l}
                </button>
              </span>
            ))}
          </div>

          <Link
            href="/contact"
            className="btn-gold-shimmer font-sans text-[13px] font-medium px-5 py-2.5 rounded-full cursor-pointer whitespace-nowrap active:scale-[0.97] transition-all duration-300"
            style={{ background: "#D9628A", color: "#080605" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.background = "#F4A8B8")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.background = "#D9628A")
            }
          >
            {t.nav.cta}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 -mr-2 cursor-pointer"
          style={{ color: "#0D0B08" }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} weight="light" /> : <List size={22} weight="light" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden overflow-hidden"
            style={{
              background: "rgba(250,247,242,0.98)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(217,98,138,0.12)",
            }}
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {navLinks.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="font-sans text-base font-light text-left cursor-pointer transition-colors duration-200"
                  style={{ color: isActive(href) ? "#0D0B08" : "rgba(13,11,8,0.65)" }}
                >
                  {label}
                </Link>
              ))}
              <div
                className="pt-4 border-t flex items-center justify-between"
                style={{ borderColor: "rgba(217,98,138,0.15)" }}
              >
                <div className="flex items-center gap-3">
                  {langs.map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      className="font-sans text-xs uppercase tracking-widest cursor-pointer"
                      style={{
                        color: lang === l ? "#F4A8B8" : "rgba(13,11,8,0.35)",
                        fontWeight: lang === l ? 600 : 300,
                      }}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                <Link
                  href="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="btn-gold-shimmer font-sans text-sm font-medium px-5 py-2.5 rounded-full cursor-pointer"
                  style={{ background: "#D9628A", color: "#080605" }}
                >
                  {t.nav.cta}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
