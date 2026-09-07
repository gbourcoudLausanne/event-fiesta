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

type Blob = { x: number; y: number; r: number; c: "pink" | "white" | "cream" };
const CLUSTER: Blob[] = [
  // rangée arrière
  { x: 84, y: 264, r: 26, c: "cream" },
  { x: 132, y: 254, r: 29, c: "pink" },
  { x: 182, y: 250, r: 31, c: "white" },
  { x: 234, y: 252, r: 30, c: "cream" },
  { x: 286, y: 256, r: 29, c: "pink" },
  { x: 336, y: 264, r: 26, c: "white" },
  // rangée avant
  { x: 52, y: 306, r: 28, c: "pink" },
  { x: 102, y: 300, r: 30, c: "white" },
  { x: 154, y: 306, r: 32, c: "pink" },
  { x: 208, y: 302, r: 31, c: "cream" },
  { x: 262, y: 306, r: 30, c: "white" },
  { x: 314, y: 302, r: 29, c: "pink" },
  { x: 366, y: 306, r: 26, c: "cream" },
  // socle
  { x: 118, y: 330, r: 23, c: "cream" },
  { x: 186, y: 332, r: 25, c: "pink" },
  { x: 256, y: 330, r: 24, c: "white" },
  { x: 322, y: 330, r: 22, c: "pink" },
];
const FILLERS: [number, number, number][] = [
  [90, 282, 10],
  [150, 276, 11],
  [210, 278, 10],
  [270, 280, 10],
  [330, 284, 10],
  [76, 322, 10],
  [156, 328, 11],
  [226, 322, 10],
  [294, 324, 10],
  [356, 322, 9],
];

function BalloonNumber() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="absolute hidden lg:block pointer-events-none"
      style={{ top: "-9.5rem", right: "-2%", width: "min(39vw, 460px)" }}
      initial={reduce ? undefined : "hidden"}
      whileInView={reduce ? undefined : "shown"}
      viewport={{ once: true, amount: 0.35 }}
    >
      <svg viewBox="0 0 440 360" fill="none" style={{ width: "100%", overflow: "visible" }} aria-hidden>
        <defs>
          <linearGradient id="pb-foil" gradientUnits="userSpaceOnUse" x1="80" y1="30" x2="300" y2="262">
            <stop offset="0%" stopColor="#F9CEDA" />
            <stop offset="38%" stopColor="#EC9FB6" />
            <stop offset="72%" stopColor="#DA7E9B" />
            <stop offset="100%" stopColor="#C86C89" />
          </linearGradient>
          <radialGradient id="pb-pink" cx="36%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#FBE0E9" />
            <stop offset="55%" stopColor="#EDA9C0" />
            <stop offset="100%" stopColor="#D083A0" />
          </radialGradient>
          <radialGradient id="pb-white" cx="36%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#FBF6EE" />
            <stop offset="100%" stopColor="#E6DAC6" />
          </radialGradient>
          <radialGradient id="pb-cream" cx="36%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#FBF3E4" />
            <stop offset="58%" stopColor="#EFE2CC" />
            <stop offset="100%" stopColor="#D8C4A5" />
          </radialGradient>
          <radialGradient id="pb-heart" cx="40%" cy="34%" r="72%">
            <stop offset="0%" stopColor="#EBDBCA" />
            <stop offset="70%" stopColor="#D9C3AF" />
            <stop offset="100%" stopColor="#BFA48C" />
          </radialGradient>
        </defs>

        <g
          style={
            reduce
              ? { transformOrigin: "210px 344px" }
              : { transformOrigin: "210px 344px", animation: "gd-sway 8s ease-in-out infinite" }
          }
        >
          {/* Chiffre 10 en ballons mylar */}
          <motion.g
            variants={{
              hidden: { opacity: 0, y: 34 },
              shown: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.35, ease } },
            }}
          >
           <g transform="translate(233 150) scale(0.8) translate(-209 -152)">
            {/* liseré sombre */}
            <g stroke="#C06985" strokeWidth="52" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5">
              <path d="M74 104 C 78 52 100 40 130 40 L 130 250" />
              <path d="M86 252 L176 252" strokeWidth="24" strokeLinecap="round" />
              <ellipse cx="256" cy="148" rx="60" ry="100" />
            </g>
            {/* corps des chiffres */}
            <g stroke="url(#pb-foil)" strokeWidth="46" strokeLinecap="round" strokeLinejoin="round" fill="none">
              {/* 1 : drapeau + fût */}
              <path d="M74 104 C 78 52 100 40 130 40 L 130 250" />
              {/* pied */}
              <path d="M86 252 L176 252" strokeWidth="20" strokeLinecap="round" />
              {/* 0 : anneau */}
              <ellipse cx="256" cy="148" rx="60" ry="100" />
            </g>
           </g>
          </motion.g>

          {/* Nœud ruban */}
          <motion.g
            variants={{
              hidden: { opacity: 0, y: -12, scale: 0.8 },
              shown: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { type: "spring", stiffness: 220, damping: 16, delay: 0.95 },
              },
            }}
            style={{ transformOrigin: "288px 60px" }}
          >
            <g transform="translate(138 -50)">
              <path d="M150 96 Q124 78 122 104 Q126 118 150 104 Z" fill="#F6CDD9" />
              <path d="M150 96 Q176 78 178 104 Q174 118 150 104 Z" fill="#F0BFCE" />
              <path d="M147 104 Q140 128 143 150 L150 144 L157 150 Q160 128 153 104 Z" fill="#F6CDD9" />
              <circle cx="150" cy="100" r="7" fill="#EBB2C4" />
            </g>
          </motion.g>

          {/* Cluster de ballons — base */}
          {CLUSTER.map((b, i) => (
            <motion.g
              key={i}
              custom={i}
              variants={{
                hidden: { scale: 0, opacity: 0 },
                shown: (idx: number) => ({
                  scale: 1,
                  opacity: 1,
                  transition: { type: "spring", stiffness: 260, damping: 15, delay: 0.05 + idx * 0.035 },
                }),
              }}
              style={{ transformOrigin: `${b.x}px ${b.y}px` }}
            >
              <circle cx={b.x} cy={b.y} r={b.r} fill={`url(#pb-${b.c})`} />
              <ellipse
                cx={b.x - b.r * 0.32}
                cy={b.y - b.r * 0.36}
                rx={b.r * 0.22}
                ry={b.r * 0.3}
                fill="rgba(255,255,255,0.55)"
                transform={`rotate(-24 ${b.x - b.r * 0.32} ${b.y - b.r * 0.36})`}
              />
            </motion.g>
          ))}
          {FILLERS.map(([x, y, r], i) => (
            <motion.circle
              key={`f${i}`}
              cx={x}
              cy={y}
              r={r}
              fill="#F4EBDB"
              style={{ transformOrigin: `${x}px ${y}px` }}
              variants={{
                hidden: { scale: 0, opacity: 0 },
                shown: {
                  scale: 1,
                  opacity: 0.9,
                  transition: { type: "spring", stiffness: 260, damping: 15, delay: 0.5 + i * 0.03 },
                },
              }}
            />
          ))}

          {/* Petit cœur devant */}
          <motion.g
            variants={{
              hidden: { scale: 0, opacity: 0 },
              shown: {
                scale: 1,
                opacity: 1,
                transition: { type: "spring", stiffness: 240, damping: 14, delay: 0.7 },
              },
            }}
            style={{ transformOrigin: "208px 262px" }}
          >
            <g transform="translate(58 0)">
              <path
                d="M150 250 C142 236 118 238 118 258 C118 280 150 300 150 300 C150 300 182 280 182 258 C182 238 158 236 150 250 Z"
                fill="url(#pb-heart)"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1"
              />
              <ellipse cx="134" cy="250" rx="6" ry="8" fill="rgba(255,255,255,0.4)" transform="rotate(-20 134 250)" />
            </g>
          </motion.g>
        </g>
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
      className="relative py-20 lg:py-28"
      style={{ background: "#F3EDE6" }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div
          className="absolute rounded-full"
          style={{
            top: "-12%",
            right: "-8%",
            width: "min(46vw, 560px)",
            aspectRatio: "1",
            background:
              "radial-gradient(circle at 50% 50%, rgba(244,168,184,0.18), rgba(244,168,184,0) 70%)",
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 lg:px-10">
        <BalloonNumber />

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
