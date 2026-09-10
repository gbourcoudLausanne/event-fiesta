"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

const STACK = [
  { src: "/Galerie/hero-slides/hero-slide-16.webp", r: -7, x: "-16%", y: "6%" },
  { src: "/Galerie/hero-slides/hero-slide-6.webp", r: 6, x: "18%", y: "-4%" },
  { src: "/Galerie/hero-slides/hero-slide-2.webp", r: -2, x: "0%", y: "0%" },
];

export function HeroDecor() {
  const reduce = useReducedMotion();

  return (
    <div
      className="pointer-events-none absolute right-0 top-[60px] z-20 hidden lg:block xl:right-[2%]"
      style={{
        width: "min(28vw, 380px)",
        maskImage: "linear-gradient(#000 82%, transparent)",
        WebkitMaskImage: "linear-gradient(#000 82%, transparent)",
      }}
      aria-hidden
    >
      {/* ratio du conteneur pour caler la hauteur */}
      <div className="relative" style={{ paddingBottom: "132%" }}>
        {STACK.map((p, i) => (
          <motion.div
            key={p.src}
            initial={reduce ? false : { opacity: 0, y: 26, rotate: p.r + 5, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, rotate: p.r, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 + i * 0.14, ease }}
            className="absolute left-1/2 top-1/2 w-[74%]"
            style={{ translateX: `calc(-50% + ${p.x})`, translateY: `calc(-50% + ${p.y})`, zIndex: i + 1 }}
          >
            <motion.div
              animate={reduce ? undefined : { y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 6 + i * 1.3, ease: "easeInOut", delay: i * 0.5 }}
              className="rounded-[10px] bg-white p-2"
              style={{
                boxShadow: "0 40px 80px -34px rgba(120,60,80,0.5), 0 8px 22px rgba(13,11,8,0.08)",
              }}
            >
              <div className="relative overflow-hidden rounded-[4px]" style={{ aspectRatio: "4 / 5" }}>
                <Image src={p.src} alt="" fill className="object-cover" sizes="320px" />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(180deg, rgba(251,230,198,0.12), transparent 40%)" }}
                />
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
