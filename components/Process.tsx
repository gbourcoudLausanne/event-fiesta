"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import {
  ChatCircleDots,
  PaintBrush,
  ClipboardText,
  Truck,
  ArrowRight,
  PushPin,
  type Icon,
} from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

const ICONS: Icon[] = [ChatCircleDots, PaintBrush, ClipboardText, Truck];

const TINTS = [
  { bg: "#FBEDF0", ink: "#B65572", pin: "#D9628A" },
  { bg: "#ECF3F6", ink: "#5E86A0", pin: "#A8CEE0" },
  { bg: "#FBF1E7", ink: "#B98A55", pin: "#F0C29A" },
  { bg: "#F3EEF7", ink: "#8B76A8", pin: "#C9B7E0" },
];

const TILT = [-2.5, 1.5, -1.5, 2.5];

const SWATCHES = [
  { c: "#F4A8B8", a: -8 },
  { c: "#F0C29A", a: -22 },
  { c: "#A8CEE0", a: -36 },
  { c: "#E88DA8", a: -50 },
  { c: "#C9B7E0", a: -64 },
  { c: "#E3C179", a: -78 },
];
const PIV = { x: 72, y: 256 };

function StudioBoard() {
  const reduce = useReducedMotion();
  const DOTS: [number, number][] = [
    [122, 214],
    [148, 112],
    [226, 60],
    [304, 112],
    [330, 214],
  ];
  return (
    <motion.div
      className="absolute hidden lg:block pointer-events-none"
      style={{ top: "-0.5rem", right: "-1%", width: "min(31vw, 340px)" }}
      initial={reduce ? undefined : "hidden"}
      whileInView={reduce ? undefined : "shown"}
      viewport={{ once: true, amount: 0.4 }}
    >
      <svg viewBox="0 0 380 300" fill="none" style={{ width: "100%", overflow: "visible" }} aria-hidden>
        <defs>
          <linearGradient id="pb-pencil" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(0,0,0,0.16)" />
            <stop offset="45%" stopColor="rgba(255,255,255,0.34)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.16)" />
          </linearGradient>
        </defs>

        {/* Arche esquissée */}
        <motion.path
          d="M122 214 C122 122 166 60 226 60 C286 60 330 122 330 214"
          stroke="#B65572"
          strokeOpacity="0.42"
          strokeWidth="1.6"
          strokeLinecap="round"
          variants={{ hidden: { pathLength: 0 }, shown: { pathLength: 1, transition: { duration: 1.1, ease } } }}
        />
        <motion.path
          d="M128 216 C128 128 170 66 227 66 C283 66 324 126 325 210"
          stroke="#B65572"
          strokeOpacity="0.18"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="2.5 4"
          variants={{ hidden: { pathLength: 0 }, shown: { pathLength: 1, transition: { duration: 1.1, delay: 0.12, ease } } }}
        />
        {DOTS.map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r="3"
            fill="#D9628A"
            style={{ transformOrigin: `${x}px ${y}px` }}
            variants={{
              hidden: { scale: 0, opacity: 0 },
              shown: {
                scale: 1,
                opacity: 0.75,
                transition: { delay: 0.5 + i * 0.12, type: "spring", stiffness: 300, damping: 14 },
              },
            }}
          />
        ))}

        {/* Éventail de nuanciers */}
        <motion.g
          animate={reduce ? undefined : { rotate: [-1.2, 1.2, -1.2] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          style={{ transformOrigin: `${PIV.x}px ${PIV.y}px` }}
        >
          {SWATCHES.map((s, i) => (
            <motion.g
              key={i}
              custom={i}
              style={{ transformOrigin: `${PIV.x}px ${PIV.y}px` }}
              variants={{
                hidden: { rotate: -6 },
                shown: (idx: number) => ({
                  rotate: s.a,
                  transition: { type: "spring", stiffness: 120, damping: 15, delay: 0.2 + idx * 0.07 },
                }),
              }}
            >
              <rect
                x={PIV.x}
                y={PIV.y - 12}
                width="120"
                height="24"
                rx="12"
                fill={s.c}
                stroke="rgba(255,255,255,0.65)"
                strokeWidth="1"
              />
            </motion.g>
          ))}
          <circle cx={PIV.x} cy={PIV.y} r="5" fill="#2A2320" opacity="0.45" />
        </motion.g>

        {/* Crayon */}
        <motion.g
          variants={{
            hidden: { opacity: 0, x: 18, y: 8 },
            shown: { opacity: 1, x: 0, y: 0, transition: { duration: 0.6, delay: 0.85, ease } },
          }}
        >
          <motion.g
            animate={reduce ? undefined : { y: [0, -6, 0], rotate: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            style={{ transformOrigin: "230px 40px" }}
          >
            <g transform="rotate(42 230 60)">
              <rect x="222" y="-14" width="14" height="118" rx="3" fill="#EBC79C" />
              <rect x="222" y="-14" width="14" height="118" rx="3" fill="url(#pb-pencil)" />
              <rect x="222" y="98" width="14" height="9" fill="#C9CDD2" />
              <rect x="222" y="105" width="14" height="12" rx="3" fill="#F2A9BC" />
              <path d="M222 -14 L236 -14 L229 -30 Z" fill="#E8B98C" />
              <path d="M226 -20 L232 -20 L229 -30 Z" fill="#3A2A20" />
            </g>
          </motion.g>
        </motion.g>
      </svg>
    </motion.div>
  );
}

export function Process() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  return (
    <section
      id="process"
      className="relative overflow-hidden py-20 lg:py-28"
      style={{ background: "#F3EDE6" }}
    >
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          top: "-12%",
          right: "-8%",
          width: "min(46vw, 560px)",
          aspectRatio: "1",
          background:
            "radial-gradient(circle at 50% 50%, rgba(244,168,184,0.18), rgba(244,168,184,0) 70%)",
        }}
        aria-hidden
      />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-10">
        <StudioBoard />

        {/* En-tête */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease }}
          className="relative z-10 max-w-2xl mb-12 lg:mb-16"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="w-10 h-px" style={{ background: "#D9628A" }} />
            <span className="font-sans text-[10px] uppercase tracking-[0.3em]" style={{ color: "#B65572" }}>
              {t.process.eyebrow}
            </span>
          </div>
          <h2
            className="font-serif font-light leading-tight tracking-tight"
            style={{ fontSize: "clamp(2.1rem, 4.4vw, 3.4rem)", color: "#2A2320" }}
          >
            {t.process.title}
          </h2>
          <p
            className="font-sans font-light text-[14.5px] leading-relaxed mt-5"
            style={{ color: "rgba(42,35,32,0.55)" }}
          >
            {t.process.intro}
          </p>
        </motion.div>

        {/* Cartes */}
        <div className="relative z-10">
          {/* Fil pointillé animé — desktop */}
          <svg
            className="absolute inset-x-0 top-1/2 hidden lg:block pointer-events-none"
            style={{ transform: "translateY(-50%)" }}
            height="2"
            viewBox="0 0 1000 2"
            preserveAspectRatio="none"
            aria-hidden
          >
            <motion.line
              x1="30"
              y1="1"
              x2="970"
              y2="1"
              stroke="#D9628A"
              strokeOpacity="0.4"
              strokeWidth="2"
              strokeDasharray="7 6"
              strokeLinecap="round"
              initial={{ strokeDashoffset: 0 }}
              animate={reduce ? undefined : { strokeDashoffset: -130 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </svg>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 sm:gap-6 lg:gap-5">
            {t.process.steps.map((s, i) => {
              const Ico = ICONS[i];
              const tint = TINTS[i % TINTS.length];
              const tilt = TILT[i % TILT.length];
              return (
                <motion.li
                  key={i}
                  initial={reduce ? false : { opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease }}
                  className="relative"
                >
                  <motion.div
                    animate={reduce ? undefined : { rotate: tilt }}
                    whileHover={reduce ? undefined : { rotate: 0, y: -6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="group relative h-full rounded-2xl bg-white p-2.5"
                    style={{ boxShadow: "0 18px 44px -22px rgba(120,60,80,0.28)" }}
                  >
                    <span
                      className="absolute left-1/2 -top-3 z-10"
                      style={{ transform: "translateX(-50%)" }}
                    >
                      <PushPin size={22} weight="fill" color={tint.pin} />
                    </span>
                    <div
                      className="rounded-xl p-5 h-full flex flex-col"
                      style={{ background: tint.bg }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className="font-display italic leading-none"
                          style={{ fontSize: "2.4rem", color: tint.ink }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {Ico && <Ico size={22} weight="light" color={tint.ink} />}
                      </div>
                      <h3
                        className="font-serif font-light text-xl leading-tight mb-2"
                        style={{ color: "#2A2320" }}
                      >
                        {s.title}
                      </h3>
                      <p
                        className="font-sans font-light text-[13px] leading-relaxed"
                        style={{ color: "rgba(42,35,32,0.6)" }}
                      >
                        {s.desc}
                      </p>
                    </div>
                  </motion.div>
                </motion.li>
              );
            })}
          </ul>
        </div>

        {/* CTA */}
        <div className="mt-12 lg:mt-14">
          <Link
            href="/contact"
            className="btn-gold-shimmer inline-flex items-center gap-2 font-sans text-[13px] font-medium px-8 py-3.5 rounded-full transition-transform duration-200 hover:scale-[1.03]"
            style={{ background: "#D9628A", color: "#FAF7F2" }}
          >
            {t.process.cta}
            <ArrowRight size={14} weight="bold" />
          </Link>
        </div>
      </div>
    </section>
  );
}
