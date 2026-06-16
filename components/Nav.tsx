"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useReducedMotion } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { useI18n, type Lang } from "@/lib/i18n";

export function Nav() {
  const { t, lang, setLang } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (y) => setScrolled(y > 48));
  }, [scrollY]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const langs: Lang[] = ["fr", "es", "en"];

  const navLinks = [
    { label: t.nav.services, href: "services" },
    { label: t.nav.realisations, href: "realisations" },
    { label: t.nav.contact, href: "contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-creme/95 backdrop-blur-sm shadow-[0_1px_0_rgba(26,20,16,0.08)]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex flex-col items-start shrink-0 cursor-pointer"
          aria-label="Event Fiesta - Retour en haut"
        >
          <div className="flex items-baseline gap-1">
            <span className="font-sans font-bold text-noir text-lg tracking-tight leading-none">
              Event
            </span>
            <span className="font-serif italic text-or text-[1.35rem] leading-[1.1] pb-0.5">
              Fiesta
            </span>
          </div>
          <span className="font-sans text-[9px] text-noir/40 tracking-normal mt-0.5">
            Décoration sur mesure · Lausanne
          </span>
        </button>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-8 flex-1 justify-center">
          {navLinks.map(({ label, href }) => (
            <li key={href}>
              <button
                onClick={() => scrollTo(href)}
                className="font-sans text-sm text-noir/60 hover:text-noir transition-colors duration-200 cursor-pointer"
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* Right: language + CTA */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          <div className="flex items-center border border-noir/20 rounded-full px-3 py-1.5 gap-2">
            {langs.map((l, i) => (
              <span key={l} className="flex items-center gap-2">
                {i > 0 && (
                  <span className="text-noir/20 text-[10px] select-none">
                    |
                  </span>
                )}
                <button
                  onClick={() => setLang(l)}
                  className={`font-sans text-[11px] uppercase tracking-wide transition-colors cursor-pointer ${
                    lang === l
                      ? "text-or font-semibold"
                      : "text-noir/40 hover:text-noir/70"
                  }`}
                  aria-label={`Langue ${l.toUpperCase()}`}
                  aria-pressed={lang === l}
                >
                  {l}
                </button>
              </span>
            ))}
          </div>
          <button
            onClick={() => scrollTo("contact")}
            className="btn-gold-shimmer font-sans text-sm font-medium bg-or text-noir px-5 py-2.5 rounded-full hover:bg-[#9a7830] transition-colors duration-200 cursor-pointer whitespace-nowrap active:scale-[0.98]"
          >
            {t.nav.cta}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden text-noir p-2 -mr-2 cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <X size={22} weight="light" />
          ) : (
            <List size={22} weight="light" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] as const }}
          className="lg:hidden bg-creme border-t border-noir/10 px-6 py-6 flex flex-col gap-5"
        >
          {navLinks.map(({ label, href }) => (
            <button
              key={href}
              onClick={() => scrollTo(href)}
              className="font-sans text-base text-noir text-left cursor-pointer"
            >
              {label}
            </button>
          ))}
          <div className="pt-4 border-t border-noir/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {langs.map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`font-sans text-xs uppercase tracking-wide cursor-pointer ${
                    lang === l
                      ? "text-or font-semibold"
                      : "text-noir/40"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <button
              onClick={() => scrollTo("contact")}
              className="font-sans text-sm font-medium bg-or text-noir px-4 py-2 rounded-full cursor-pointer"
            >
              {t.nav.cta}
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
}
