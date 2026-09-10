"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

export function HeroDecor() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "-16%"]);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute right-0 top-[52px] z-20 hidden lg:block xl:right-[3%]"
      style={{ width: "min(26vw, 355px)" }}
      aria-hidden
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease }}
        className="relative overflow-hidden rounded-[24px]"
        style={{
          aspectRatio: "0.64 / 1",
          border: "1px solid rgba(42,35,32,0.06)",
          boxShadow:
            "0 54px 100px -46px rgba(120,60,80,0.5), 0 14px 36px rgba(13,11,8,0.09)",
          maskImage: "linear-gradient(#000 74%, transparent)",
          WebkitMaskImage: "linear-gradient(#000 74%, transparent)",
        }}
      >
        <motion.div className="absolute inset-x-0 -top-[12%] -bottom-[12%]" style={{ y }}>
          <Image
            src="/Galerie/hero-slides/hero-slide-2.webp"
            alt=""
            fill
            className="object-cover"
            style={{ objectPosition: "center 30%" }}
            sizes="360px"
          />
        </motion.div>

        {/* Lumière chaude + vignettage doux */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(175deg, rgba(251,230,198,0.16) 0%, transparent 38%), radial-gradient(120% 80% at 50% 8%, transparent 55%, rgba(42,35,32,0.14) 100%)",
          }}
        />
      </motion.div>
    </div>
  );
}
