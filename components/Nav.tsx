"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useReducedMotion } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { useI18n, type Lang } from "@/lib/i18n";

export function Nav() {
  const { t, lang, setLang } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (y) => setScrolled(y > 60));
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
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(8,6,5,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(1.6)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(1.6)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(176,139,58,0.1)"
          : "1px solid transparent",
      }}
    >
      {/* Gold accent line bottom */}
      <motion.div
        className="absolute bottom-0 left-0 h-px origin-left"
        style={{
          background: "linear-gradient(90deg, #B08B3A 0%, #C9A84C 50%, rgba(176,139,58,0.3) 100%)",
          scaleX: scrolled ? 1 : 0,
        }}
        transition={{ duration: 0.5 }}
        aria-hidden
      />

      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-[68px] flex items-center justify-between gap-6">

        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex flex-col items-start shrink-0 cursor-pointer group"
          aria-label="Event Fiesta — Retour en haut"
        >
          <div className="flex items-baseline gap-1.5">
            <span
              className="font-sans font-medium text-lg tracking-[0.12em] uppercase leading-none transition-colors duration-300"
              style={{ color: "#FAF7F2" }}
            >
              Event
            </span>
            <span
              className="font-serif italic font-light text-[1.4rem] leading-[1.1] transition-all duration-300 group-hover:tracking-wide"
              style={{ color: "#C9A84C" }}
            >
              Fiesta
            </span>
          </div>
          <span
            className="font-sans text-[8px] tracking-[0.2em] uppercase mt-0.5"
            style={{ color: "rgba(250,247,242,0.28)", letterSpacing: "0.22em" }}
          >
            Décoration sur mesure
          </span>
        </button>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-10 flex-1 justify-center">
          {navLinks.map(({ label, href }) => (
            <li key={href}>
              <button
                onClick={() => scrollTo(href)}
                className="nav-link font-sans text-[13px] font-light tracking-wide cursor-pointer transition-colors duration-200 pb-0.5"
                style={{ color: "rgba(250,247,242,0.52)" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = "#FAF7F2")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color =
                    "rgba(250,247,242,0.52)")
                }
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* Right: language + CTA */}
        <div className="hidden lg:flex items-center gap-5 shrink-0">
          <div className="flex items-center gap-1">
            {langs.map((l, i) => (
              <span key={l} className="flex items-center gap-1">
                {i > 0 && (
                  <span style={{ color: "rgba(250,247,242,0.15)", fontSize: 10 }}>·</span>
                )}
                <button
                  onClick={() => setLang(l)}
                  className="font-sans text-[11px] uppercase tracking-widest cursor-pointer transition-all duration-200 px-1 py-0.5 rounded"
                  style={{
                    color: lang === l ? "#C9A84C" : "rgba(250,247,242,0.3)",
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

          <button
            onClick={() => scrollTo("contact")}
            className="btn-gold-shimmer font-sans text-[13px] font-medium px-5 py-2.5 rounded-full cursor-pointer whitespace-nowrap active:scale-[0.97] transition-all duration-300"
            style={{ background: "#B08B3A", color: "#080605" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = "#C9A84C")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = "#B08B3A")
            }
          >
            {t.nav.cta}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 -mr-2 cursor-pointer"
          style={{ color: "#FAF7F2" }}
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
              background: "rgba(8,6,5,0.98)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(176,139,58,0.12)",
            }}
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {navLinks.map(({ label, href }) => (
                <button
                  key={href}
                  onClick={() => scrollTo(href)}
                  className="font-sans text-base font-light text-left cursor-pointer transition-colors duration-200"
                  style={{ color: "rgba(250,247,242,0.65)" }}
                >
                  {label}
                </button>
              ))}
              <div
                className="pt-4 border-t flex items-center justify-between"
                style={{ borderColor: "rgba(176,139,58,0.15)" }}
              >
                <div className="flex items-center gap-3">
                  {langs.map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      className="font-sans text-xs uppercase tracking-widest cursor-pointer"
                      style={{
                        color: lang === l ? "#C9A84C" : "rgba(250,247,242,0.3)",
                        fontWeight: lang === l ? 600 : 300,
                      }}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => scrollTo("contact")}
                  className="btn-gold-shimmer font-sans text-sm font-medium px-5 py-2.5 rounded-full cursor-pointer"
                  style={{ background: "#B08B3A", color: "#080605" }}
                >
                  {t.nav.cta}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
