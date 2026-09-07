"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

const PARTICULIERS_KEYS = ["mariage", "anniversaire", "babyshower", "genderreveal", "bapteme", "piquenique"];

const TINTS = [
  { bg: "#FBEDF0", dot: "#F4A8B8" },
  { bg: "#ECF3F6", dot: "#A8CEE0" },
  { bg: "#FBF1E7", dot: "#F0C29A" },
];

// Ballons le long de l'arche (viewBox 400×400)
const ARCH_BALLOONS: { cx: number; cy: number; r: number; c: string }[] = [
  { cx: 27, cy: 388, r: 14, c: "#F4A8B8" }, { cx: 17, cy: 356, r: 9, c: "#FBD5DE" },
  { cx: 34, cy: 338, r: 16, c: "#A8CEE0" }, { cx: 23, cy: 308, r: 11, c: "#FAF7F2" },
  { cx: 40, cy: 286, r: 17, c: "#F0C29A" }, { cx: 29, cy: 260, r: 10, c: "#F4A8B8" },
  { cx: 45, cy: 236, r: 15, c: "#FBD5DE" }, { cx: 37, cy: 210, r: 12, c: "#A8CEE0" },
  { cx: 55, cy: 186, r: 17, c: "#F4A8B8" }, { cx: 47, cy: 160, r: 10, c: "#FAF7F2" },
  { cx: 66, cy: 138, r: 14, c: "#F0C29A" }, { cx: 60, cy: 114, r: 11, c: "#F4A8B8" },
  { cx: 83, cy: 94, r: 16, c: "#FBD5DE" },  { cx: 110, cy: 66, r: 12, c: "#A8CEE0" },
  { cx: 140, cy: 46, r: 18, c: "#F4A8B8" }, { cx: 172, cy: 35, r: 11, c: "#FAF7F2" },
  { cx: 200, cy: 31, r: 16, c: "#F0C29A" }, { cx: 228, cy: 37, r: 13, c: "#F4A8B8" },
  { cx: 258, cy: 49, r: 17, c: "#FBD5DE" }, { cx: 288, cy: 70, r: 12, c: "#A8CEE0" },
  { cx: 312, cy: 98, r: 15, c: "#F4A8B8" }, { cx: 326, cy: 126, r: 12, c: "#F0C29A" },
  { cx: 341, cy: 154, r: 17, c: "#FBD5DE" },{ cx: 332, cy: 182, r: 10, c: "#FAF7F2" },
  { cx: 349, cy: 210, r: 16, c: "#F4A8B8" },{ cx: 340, cy: 238, r: 11, c: "#A8CEE0" },
  { cx: 357, cy: 266, r: 17, c: "#F0C29A" },{ cx: 347, cy: 294, r: 12, c: "#F4A8B8" },
  { cx: 363, cy: 322, r: 14, c: "#FBD5DE" },{ cx: 353, cy: 350, r: 10, c: "#FAF7F2" },
  { cx: 369, cy: 380, r: 15, c: "#F4A8B8" },
];

function ArchLine() {
  const reduce = useReducedMotion();
  return (
    <motion.svg
      className="absolute pointer-events-none hidden lg:block"
      style={{ top: "5%", right: "-4%", width: "min(32vw, 440px)", overflow: "visible" }}
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden
      initial={reduce ? undefined : "hidden"}
      whileInView={reduce ? undefined : "shown"}
      viewport={{ once: true, amount: 0.4 }}
    >
      <motion.path
        d="M20 400 C20 190 100 30 200 30 C300 30 380 190 380 400"
        stroke="rgba(217,98,138,0.18)"
        strokeWidth="1.5"
        strokeLinecap="round"
        variants={{ hidden: { pathLength: 0 }, shown: { pathLength: 1 } }}
        transition={{ duration: 1.5, ease }}
      />
      <motion.g variants={{ shown: { transition: { staggerChildren: 0.03, delayChildren: 0.35 } } }}>
        {ARCH_BALLOONS.map((b, i) => (
          <motion.circle
            key={i}
            cx={b.cx}
            cy={b.cy}
            r={b.r}
            fill={b.c}
            stroke="rgba(13,11,8,0.04)"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            variants={{ hidden: { scale: 0, opacity: 0 }, shown: { scale: 1, opacity: 0.4 } }}
            transition={{ type: "spring", stiffness: 260, damping: 16 }}
          />
        ))}
      </motion.g>
    </motion.svg>
  );
}

type Card = { key: string; name: string; desc: string };

export function Services() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<"part" | "pro">("part");

  const particuliers: Card[] = t.services.index.filter((x) =>
    PARTICULIERS_KEYS.includes(x.key),
  );
  const pro: Card[] = t.services.proItems.map((p) => ({
    key: p.key,
    name: p.title,
    desc: p.desc,
  }));
  const cards = tab === "part" ? particuliers : pro;

  const tabs = [
    { id: "part" as const, label: t.services.particuliers.label },
    { id: "pro" as const, label: t.services.professionnels.label },
  ];

  return (
    <section
      id="services"
      className="relative overflow-hidden py-20 lg:py-28"
      style={{ background: "#FAF7F2" }}
    >
      {/* Grain */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-multiply"
        style={{
          opacity: 0.32,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />
      <ArchLine />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        {/* En-tête */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease }}
          className="max-w-2xl mb-10 lg:mb-12"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="w-10 h-px" style={{ background: "#D9628A" }} />
            <span className="font-sans text-[10px] uppercase tracking-[0.3em]" style={{ color: "#B65572" }}>
              {t.services.eyebrow}
            </span>
          </div>
          <h2
            className="font-serif font-light leading-tight tracking-tight"
            style={{ fontSize: "clamp(2.3rem, 4.6vw, 3.8rem)", color: "#2A2320" }}
          >
            {t.services.title}
          </h2>
          <p
            className="font-sans font-light text-[14.5px] leading-relaxed mt-5"
            style={{ color: "rgba(42,35,32,0.55)" }}
          >
            {t.services.intro}
          </p>
        </motion.div>

        {/* Onglets */}
        <div
          className="flex items-center gap-8 mb-8 lg:mb-10 border-b"
          style={{ borderColor: "rgba(42,35,32,0.12)" }}
        >
          {tabs.map((tb) => {
            const on = tab === tb.id;
            return (
              <button
                key={tb.id}
                type="button"
                onClick={() => setTab(tb.id)}
                className="relative pb-4 font-serif font-light transition-colors duration-300 cursor-pointer"
                style={{
                  fontSize: "clamp(1.1rem, 1.9vw, 1.55rem)",
                  color: on ? "#B65572" : "rgba(42,35,32,0.4)",
                  fontStyle: on ? "italic" : "normal",
                }}
              >
                {tb.label}
                {on && (
                  <motion.span
                    layoutId="svc-tab-underline"
                    className="absolute left-0 right-0 -bottom-px h-[2px]"
                    style={{ background: "#D9628A" }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Grille dynamique */}
        <AnimatePresence mode="wait">
          <motion.ul
            key={tab}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4"
          >
            {cards.map((it, i) => {
              const tint = TINTS[i % TINTS.length];
              return (
                <motion.li
                  key={it.key}
                  initial={reduce ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05, ease }}
                >
                  <Link
                    href="/nos-services"
                    className="group relative flex h-full flex-col p-6 lg:p-7 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                    style={{ background: tint.bg, minHeight: 196, boxShadow: "0 1px 2px rgba(13,11,8,0.03)" }}
                  >
                    <div className="flex items-center justify-between mb-5">
                      <span className="font-sans text-[11px] tabular-nums" style={{ color: "rgba(13,11,8,0.35)" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="w-2 h-2 rounded-full" style={{ background: tint.dot }} aria-hidden />
                    </div>
                    <h3
                      className="font-serif font-light text-xl lg:text-2xl leading-tight"
                      style={{ color: "#2A2320" }}
                    >
                      {it.name}
                    </h3>
                    <p
                      className="font-sans font-light text-[13px] leading-relaxed mt-2 flex-1"
                      style={{ color: "rgba(42,35,32,0.55)" }}
                    >
                      {it.desc}
                    </p>
                    <ArrowUpRight
                      size={15}
                      weight="bold"
                      className="mt-4 opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                      style={{ color: "#B65572" }}
                    />
                  </Link>
                </motion.li>
              );
            })}
          </motion.ul>
        </AnimatePresence>

        <Link
          href="/nos-services"
          className="group mt-10 lg:mt-12 inline-flex items-center gap-2 font-sans text-[12px] font-medium uppercase tracking-[0.18em]"
          style={{ color: "#B65572" }}
        >
          {t.services.ctaAll}
          <ArrowRight size={13} weight="bold" className="transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
