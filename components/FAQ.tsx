"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;
const spring = { type: "spring", stiffness: 320, damping: 24 } as const;

/* ── Bouquet de ballons — petite animation de clôture ─────────────────── */
const BQ = [
  { cx: 48, cy: 60, rx: 30, ry: 35, grad: "faq-rose", d: 0 },
  { cx: 106, cy: 46, rx: 33, ry: 39, grad: "faq-blue", d: 0.1 },
  { cx: 152, cy: 74, rx: 27, ry: 32, grad: "faq-peach", d: 0.2 },
  { cx: 92, cy: 96, rx: 25, ry: 30, grad: "faq-cream", d: 0.3 },
];
const KNOT = { x: 94, y: 214 };
const BQ_CONFETTI = [
  { x: 22, c: "#F2A6B8", delay: 0 },
  { x: 172, c: "#AFD2E1", delay: 2.6 },
  { x: 122, c: "#F0C29A", delay: 4.4 },
];

function ClosingBouquet() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="hidden lg:block mt-12 pointer-events-none"
      style={{ width: "min(15vw, 200px)" }}
      initial={reduce ? undefined : "hidden"}
      whileInView={reduce ? undefined : "shown"}
      viewport={{ once: true, amount: 0.5 }}
      aria-hidden
    >
      <svg viewBox="0 0 200 250" fill="none" style={{ width: "100%", overflow: "visible" }}>
        <defs>
          <radialGradient id="faq-rose" cx="36%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#FCE2E9" />
            <stop offset="55%" stopColor="#F2A6B8" />
            <stop offset="100%" stopColor="#DE7C98" />
          </radialGradient>
          <radialGradient id="faq-blue" cx="36%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#E4F0F5" />
            <stop offset="55%" stopColor="#AFD2E1" />
            <stop offset="100%" stopColor="#7FB0C6" />
          </radialGradient>
          <radialGradient id="faq-peach" cx="36%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#FBE7D3" />
            <stop offset="55%" stopColor="#F0C29A" />
            <stop offset="100%" stopColor="#D89E70" />
          </radialGradient>
          <radialGradient id="faq-cream" cx="36%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#FFFDFA" />
            <stop offset="55%" stopColor="#F3EBDF" />
            <stop offset="100%" stopColor="#DFD2BF" />
          </radialGradient>
        </defs>

        {!reduce &&
          BQ_CONFETTI.map((f, i) => (
            <motion.circle
              key={`c${i}`}
              cx={f.x}
              cy={0}
              r={3}
              fill={f.c}
              animate={{ y: [0, 250], opacity: [0, 0.7, 0.7, 0], rotate: [0, 220] }}
              transition={{ repeat: Infinity, duration: 9 + i, ease: "linear", delay: f.delay }}
              style={{ transformOrigin: `${f.x}px 0px` }}
            />
          ))}

        <motion.g
          animate={reduce ? undefined : { rotate: [-1.8, 1.8, -1.8], y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 7.5, ease: "easeInOut" }}
          style={{ transformOrigin: `${KNOT.x}px ${KNOT.y}px` }}
        >
          {BQ.map((b, i) => (
            <motion.path
              key={`s${i}`}
              d={`M${b.cx} ${b.cy + b.ry} Q ${(b.cx + KNOT.x) / 2 + (i % 2 ? 12 : -12)} ${(b.cy + b.ry + KNOT.y) / 2} ${KNOT.x} ${KNOT.y}`}
              stroke="rgba(42,35,32,0.26)"
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                shown: { pathLength: 1, opacity: 1, transition: { duration: 0.7, delay: 0.35 + b.d } },
              }}
            />
          ))}

          {BQ.map((b, i) => (
            <motion.g
              key={`b${i}`}
              variants={{
                hidden: { scale: 0, opacity: 0 },
                shown: {
                  scale: 1,
                  opacity: 1,
                  transition: { type: "spring", stiffness: 260, damping: 14, delay: b.d },
                },
              }}
              style={{ transformOrigin: `${b.cx}px ${b.cy}px` }}
            >
              <ellipse cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry} fill={`url(#${b.grad})`} />
              <ellipse
                cx={b.cx - b.rx * 0.32}
                cy={b.cy - b.ry * 0.34}
                rx={b.rx * 0.2}
                ry={b.ry * 0.28}
                fill="rgba(255,255,255,0.5)"
                transform={`rotate(-22 ${b.cx - b.rx * 0.32} ${b.cy - b.ry * 0.34})`}
              />
              <path d={`M${b.cx - 4} ${b.cy + b.ry} q 4 5 8 0`} fill={`url(#${b.grad})`} />
            </motion.g>
          ))}

          <motion.circle
            cx={KNOT.x}
            cy={KNOT.y}
            r={5}
            fill="#E8B8C6"
            variants={{ hidden: { scale: 0 }, shown: { scale: 1, transition: { delay: 0.55 } } }}
            style={{ transformOrigin: `${KNOT.x}px ${KNOT.y}px` }}
          />
        </motion.g>
      </svg>
    </motion.div>
  );
}

function FAQItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: { q: string; a: string };
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const reduce = useReducedMotion();
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease }}
    >
      <motion.div
        initial={false}
        animate={{
          backgroundColor: isOpen ? "rgba(250,247,242,1)" : "rgba(250,247,242,0.45)",
          boxShadow: isOpen
            ? "0 26px 52px -30px rgba(120,60,80,0.30)"
            : "0 1px 0 rgba(120,60,80,0)",
        }}
        transition={{ duration: 0.4, ease }}
        className="group relative overflow-hidden rounded-2xl"
        style={{ border: "1px solid rgba(42,35,32,0.10)" }}
      >
        {/* Accent rose qui se déploie à l'ouverture */}
        <motion.span
          className="absolute left-0 top-0 bottom-0 w-[3px] origin-top"
          style={{ background: "linear-gradient(#F2879E, #C24B72)" }}
          initial={false}
          animate={{ scaleY: isOpen ? 1 : 0 }}
          transition={{ duration: 0.4, ease }}
          aria-hidden
        />

        <button
          onClick={onToggle}
          aria-expanded={isOpen}
          className="relative flex w-full items-center gap-4 px-5 py-5 text-left cursor-pointer sm:px-7 sm:py-6"
        >
          <span
            className="shrink-0 font-display italic leading-none transition-colors duration-300"
            style={{
              fontSize: "1.05rem",
              color: isOpen ? "#B65572" : "rgba(42,35,32,0.28)",
            }}
          >
            {num}
          </span>

          <span
            className="flex-1 font-serif font-light leading-snug transition-colors duration-300"
            style={{
              fontSize: "clamp(1.02rem, 1.5vw, 1.2rem)",
              color: isOpen ? "#B65572" : "#2A2320",
            }}
          >
            {item.q}
          </span>

          <motion.span
            className="relative shrink-0 flex h-8 w-8 items-center justify-center rounded-full"
            initial={false}
            animate={{
              backgroundColor: isOpen ? "#D9628A" : "rgba(217,98,138,0)",
              borderColor: isOpen ? "#D9628A" : "rgba(42,35,32,0.16)",
              rotate: isOpen ? 135 : 0,
            }}
            transition={spring}
            style={{ border: "1px solid rgba(42,35,32,0.16)" }}
            aria-hidden
          >
            <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
              <path
                d="M5 1v8M1 5h8"
                stroke={isOpen ? "#FAF7F2" : "#B65572"}
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease }}
            >
              <motion.p
                initial={reduce ? false : { y: -6 }}
                animate={{ y: 0 }}
                exit={{ y: -6 }}
                transition={{ duration: 0.35, ease }}
                className="font-sans font-light leading-relaxed px-5 pb-6 pl-[3.35rem] pr-6 sm:px-7 sm:pb-7 sm:pl-[4rem] sm:pr-10"
                style={{ fontSize: "13.5px", color: "rgba(42,35,32,0.62)" }}
              >
                {item.a}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export function FAQ({ preview = false }: { preview?: boolean }) {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const faqs = preview ? t.faq.items.slice(0, 4) : t.faq.items;

  return (
    <section className="relative overflow-hidden py-20 lg:py-28" style={{ background: "#F3EDE6" }}>
      {/* Halo décoratif */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          top: "-14%",
          left: "-10%",
          width: "min(44vw, 520px)",
          aspectRatio: "1",
          background:
            "radial-gradient(circle at 55% 55%, rgba(244,168,184,0.16), rgba(244,168,184,0) 70%)",
        }}
        aria-hidden
      />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.5fr] gap-12 lg:gap-16">
          {/* Colonne intro */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="w-10 h-px" style={{ background: "#D9628A" }} />
              <span
                className="font-sans text-[10px] uppercase tracking-[0.3em]"
                style={{ color: "#B65572" }}
              >
                {t.faq.eyebrow}
              </span>
            </div>
            <h2
              className="font-serif font-light leading-[1.08] tracking-tight mb-5"
              style={{ fontSize: "clamp(2.1rem, 4.4vw, 3.3rem)", color: "#2A2320" }}
            >
              {t.faq.title}
            </h2>
            <p
              className="font-sans font-light text-[14px] leading-relaxed mb-6 max-w-xs"
              style={{ color: "rgba(42,35,32,0.55)" }}
            >
              {t.faq.note}
            </p>

            <motion.a
              href="https://wa.me/41779143855"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 font-sans text-[13px] font-medium px-6 py-3 rounded-full"
              style={{
                background: "#FAF7F2",
                color: "#2A2320",
                border: "1px solid rgba(42,35,32,0.14)",
                boxShadow: "0 14px 34px -18px rgba(120,60,80,0.28)",
              }}
              whileHover={reduce ? {} : { scale: 1.04, y: -2 }}
              whileTap={reduce ? {} : { scale: 0.97 }}
              transition={spring}
            >
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full"
                style={{ background: "#25D366" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </span>
              {t.faq.cta}
            </motion.a>

            <ClosingBouquet />
          </motion.div>

          {/* Accordéon */}
          <div className="flex flex-col gap-3">
            {faqs.map((item, i) => (
              <FAQItem
                key={i}
                item={item}
                index={i}
                isOpen={openIdx === i}
                onToggle={() => setOpenIdx(openIdx === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
