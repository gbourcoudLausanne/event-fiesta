"use client";

import { useRef } from "react";
import type { MouseEvent } from "react";
import { motion, useReducedMotion, useMotionValue, useSpring } from "motion/react";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";

const ease = [0.16, 1, 0.3, 1] as const;

// Teintes rose-family, réutilisées sur l'accueil et /nos-services
export const SERVICE_TINTS = [
  { bg: "#FCEEF1", dot: "#F4A8B8" }, // blush clair
  { bg: "#FDEAE1", dot: "#EF9F86" }, // corail
  { bg: "#FCEFDD", dot: "#F0BC86" }, // pêche
  { bg: "#FBE3EB", dot: "#D96A96" }, // rose vif
  { bg: "#F3E7F0", dot: "#BF88B4" }, // mauve
  { bg: "#EEE9F6", dot: "#A78ECF" }, // lilas
  { bg: "#F7E6DF", dot: "#CE8C7C" }, // terracotta rosé
  { bg: "#F6DEE6", dot: "#C25E7E" }, // baie
];

export type ServiceCardData = { key: string; name: string; desc: string };

export function ServiceCard({
  card,
  i,
  tint,
  href = "/nos-services",
  cta,
}: {
  card: ServiceCardData;
  i: number;
  tint: { bg: string; dot: string };
  href?: string;
  cta: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 18 });
  const sry = useSpring(ry, { stiffness: 200, damping: 18 });

  const onMove = (e: MouseEvent) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 8);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay: (i % 3) * 0.07, ease }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        whileHover={reduce ? undefined : { boxShadow: `0 36px 70px -28px ${tint.dot}88` }}
        style={{
          rotateX: srx,
          rotateY: sry,
          transformStyle: "preserve-3d",
          boxShadow: "0 2px 10px rgba(42,35,32,0.04)",
        }}
        className="group relative h-full"
      >
        <Link
          href={href}
          className="relative flex h-full flex-col overflow-hidden p-6 lg:p-8"
          style={{
            background: `linear-gradient(158deg, ${tint.bg} 0%, #FAF7F2 135%)`,
            border: `1px solid ${tint.dot}3d`,
            minHeight: 232,
          }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -right-3 -top-6 select-none font-serif font-light leading-none transition-transform duration-500 group-hover:scale-110"
            style={{ fontSize: "6rem", color: `${tint.dot}24` }}
          >
            {String(i + 1).padStart(2, "0")}
          </span>

          <div className="relative z-10 flex h-full flex-col">
            <span className="mb-6 h-2.5 w-2.5 rounded-full" style={{ background: tint.dot }} aria-hidden />
            <h3
              className="font-serif leading-tight"
              style={{ fontSize: "clamp(1.3rem, 2vw, 1.7rem)", color: "#2A2320" }}
            >
              {card.name}
            </h3>
            <p
              className="mt-2.5 flex-1 font-sans text-[13.5px] leading-relaxed"
              style={{ color: "rgba(40,34,30,0.56)" }}
            >
              {card.desc}
            </p>
            <span
              className="mt-5 inline-flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] opacity-75 transition-opacity duration-300 group-hover:opacity-100"
              style={{ color: "#B0546F" }}
            >
              {cta}
              <ArrowUpRight
                size={13}
                weight="bold"
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </div>
        </Link>
      </motion.div>
    </motion.li>
  );
}
