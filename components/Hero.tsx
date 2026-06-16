"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import Image from "next/image";
import { PaintBrush, Key, Heart } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n";

const featureIcons = [PaintBrush, Key, Heart];
const ease = [0.16, 1, 0.3, 1] as const;

const PARTICLES = [
  { x: 8, y: 15, size: 3, delay: 0, dur: 4.5 },
  { x: 18, y: 65, size: 2, delay: 1.2, dur: 5.5 },
  { x: 32, y: 40, size: 4, delay: 0.6, dur: 6 },
  { x: 45, y: 80, size: 2, delay: 2.1, dur: 4 },
  { x: 58, y: 25, size: 3, delay: 0.4, dur: 5 },
  { x: 70, y: 55, size: 2, delay: 1.7, dur: 6.5 },
  { x: 80, y: 10, size: 4, delay: 3, dur: 4.5 },
  { x: 88, y: 70, size: 2, delay: 0.9, dur: 5 },
  { x: 25, y: 90, size: 3, delay: 2.5, dur: 5.5 },
  { x: 62, y: 88, size: 2, delay: 1.4, dur: 4 },
  { x: 92, y: 35, size: 3, delay: 0.7, dur: 6 },
  { x: 50, y: 48, size: 2, delay: 3.2, dur: 4.5 },
  { x: 12, y: 45, size: 2, delay: 1.8, dur: 5 },
  { x: 75, y: 92, size: 3, delay: 2.8, dur: 5.5 },
] as const;

function AnimatedHeadline({
  text,
  className,
  startDelay = 0,
}: {
  text: string;
  className?: string;
  startDelay?: number;
}) {
  const reduce = useReducedMotion();
  const chars = Array.from(text);

  if (reduce) return <span className={className}>{text}</span>;

  return (
    <span className={className} aria-label={text}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.35,
            delay: startDelay + i * 0.038,
            ease,
          }}
          style={{ display: char === " " ? "inline" : "inline-block" }}
          aria-hidden
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </span>
  );
}

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.85 } },
};

const itemVariants: Variants = {
  hidden: { y: 20 },
  visible: { y: 0, transition: { duration: 0.65, ease } },
};

export function Hero() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  const headline1Delay = 0.2;
  const headline2Delay = headline1Delay + Array.from(t.hero.headline1).length * 0.038 + 0.08;

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex items-center pt-16 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #fdf9f5 0%, #fdf0ef 25%, #fdf9f5 50%, #fdf7ef 75%, #fdf9f5 100%)",
        backgroundSize: "400% 400%",
        animation: reduce ? "none" : "gradient-shift 14s ease infinite",
      }}
    >
      {/* Floating gold particles */}
      {!reduce && (
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          aria-hidden
        >
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-or"
              style={{
                width: p.size,
                height: p.size,
                left: `${p.x}%`,
                top: `${p.y}%`,
                animation: `float-particle ${p.dur}s ease-in-out ${p.delay}s infinite`,
                opacity: 0.18,
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-16 items-center">
          {/* Left: text content */}
          <motion.div
            variants={containerVariants}
            initial={reduce ? false : "hidden"}
            animate="visible"
            className="flex flex-col gap-8"
          >
            {/* Headline — letter by letter */}
            <div className="flex flex-col">
              <h1 className="font-serif font-light text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-noir">
                <AnimatedHeadline
                  text={t.hero.headline1}
                  startDelay={headline1Delay}
                />
              </h1>
              <h1 className="font-serif italic font-light text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-noir pb-1">
                <AnimatedHeadline
                  text={t.hero.headline2}
                  startDelay={headline2Delay}
                />
              </h1>
            </div>

            {/* Subtext */}
            <motion.p
              variants={itemVariants}
              className="font-sans text-base md:text-lg text-[#534d49] leading-relaxed max-w-md"
            >
              {t.hero.subtext}
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3"
            >
              <a
                href="#services"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("services")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center font-sans text-sm font-medium border-2 border-noir text-noir px-7 py-3.5 rounded-full hover:bg-noir hover:text-creme transition-all duration-200 cursor-pointer active:scale-[0.98] whitespace-nowrap"
              >
                {t.hero.cta1}
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn-gold-shimmer inline-flex items-center justify-center font-sans text-sm font-medium bg-or text-noir px-7 py-3.5 rounded-full hover:bg-[#9a7830] transition-colors duration-200 cursor-pointer active:scale-[0.98] whitespace-nowrap"
              >
                {t.hero.cta2}
              </a>
            </motion.div>

            {/* Features */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-5 pt-4 border-t border-noir/10"
            >
              {t.hero.features.map((f, i) => {
                const Icon = featureIcons[i];
                return (
                  <div key={i} className="flex items-center gap-2.5">
                    <Icon size={16} weight="light" className="text-or shrink-0" />
                    <span className="font-sans text-sm text-noir/70">
                      {f.label}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Right: image mosaic + rotating badge */}
          <div className="relative hidden lg:block">
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease }}
              className="grid grid-cols-3 grid-rows-2 gap-3 h-[520px]"
            >
              {/* Top left: wide */}
              <div className="col-span-2 row-span-1 relative rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80"
                  alt="Ballons colorés pour événement"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1280px) 40vw, 480px"
                />
              </div>
              {/* Right: tall */}
              <div className="col-span-1 row-span-2 relative rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=400&q=80"
                  alt="Table décorée pour réception"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 20vw, 230px"
                />
              </div>
              {/* Bottom left */}
              <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=500&q=80"
                  alt="Décoration florale élégante"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 20vw, 230px"
                />
              </div>
              {/* Bottom middle */}
              <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=500&q=80"
                  alt="Ambiance de fête"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 20vw, 230px"
                />
              </div>
            </motion.div>

            {/* Rotating circular badge */}
            {!reduce && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                className="absolute -top-5 -right-5 w-[96px] h-[96px] pointer-events-none z-10"
                aria-hidden
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <path
                      id="hero-badge-path"
                      d="M50,50 m-43,0 a43,43 0 1,1 86,0 a43,43 0 1,1 -86,0"
                    />
                  </defs>
                  <circle cx="50" cy="50" r="4" fill="#B08B3A" opacity="0.8" />
                  <text
                    fontSize="10.5"
                    fontFamily="Montserrat, sans-serif"
                    letterSpacing="2.2"
                    fill="#B08B3A"
                  >
                    <textPath href="#hero-badge-path">
                      Lausanne · Suisse romande ·
                    </textPath>
                  </text>
                </svg>
              </motion.div>
            )}
          </div>

          {/* Mobile: single hero image */}
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
            className="lg:hidden relative aspect-[4/3] rounded-2xl overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80"
              alt="Décoration événement festive"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw"
            />
          </motion.div>
        </div>
      </div>

      {/* Subtle decorative accent */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-noir/[0.06]"
        aria-hidden
      />
    </section>
  );
}
