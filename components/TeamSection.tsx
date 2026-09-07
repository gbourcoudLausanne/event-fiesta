"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion, useInView, useMotionValue, useTransform, animate } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

const VALUES = [
  { icon: "✦", color: "#F4A8B8", label: "Passion", desc: "Chaque ballon, chaque fleur, chaque détail est posé avec amour." },
  { icon: "◈", color: "#A8CEE0", label: "Sur mesure", desc: "Zéro template. Chaque décoration est unique et pensée pour vous." },
  { icon: "◇", color: "#F0C29A", label: "Fiabilité", desc: "On s'engage sur les délais, les couleurs et la qualité. Toujours." },
];

const STATS = [
  { to: 200, suffix: "+", label: "Événements" },
  { to: 5,   suffix: "★", label: "Note client" },
  { to: 100, suffix: "%", label: "Sur mesure" },
];

function Counter({ to, suffix, delay = 0 }: { to: number; suffix: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(count, to, { duration: 1.8, delay, ease: [0.16, 1, 0.3, 1] });
    return ctrl.stop;
  }, [inView, count, to, delay]);

  return (
    <span className="tabular-nums">
      <motion.span ref={ref}>{rounded}</motion.span>{suffix}
    </span>
  );
}

function ValueCard({ v, i, inView, reduce }: {
  v: typeof VALUES[0];
  i: number;
  inView: boolean;
  reduce: boolean | null;
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, x: 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.65, delay: i * 0.12, ease }}
      whileHover={reduce ? {} : {
        y: -3,
        borderColor: "rgba(217,98,138,0.4)",
        boxShadow: "0 12px 40px rgba(13,11,8,0.1), inset 0 0 0 1px rgba(217,98,138,0.25)",
      }}
      className="flex items-start gap-5 p-6 rounded-2xl"
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(217,98,138,0.18)",
        boxShadow: "0 4px 24px rgba(13,11,8,0.05)",
        transition: "border-color 0.3s, box-shadow 0.3s, transform 0.3s",
      }}
    >
      <motion.span
        className="w-3 h-3 rounded-full mt-1.5 shrink-0"
        style={{ background: v.color }}
        whileHover={reduce ? {} : { scale: 1.4 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
        aria-hidden
      />
      <div>
        <h3 className="font-serif font-light text-xl mb-1.5" style={{ color: "#0D0B08" }}>
          {v.label}
        </h3>
        <p className="font-sans font-light text-[13px] leading-relaxed" style={{ color: "rgba(13,11,8,0.55)" }}>
          {v.desc}
        </p>
      </div>
    </motion.div>
  );
}

export function TeamSection() {
  const reduce = useReducedMotion();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="about" className="py-24 lg:py-32 overflow-hidden relative" style={{ background: "#F3EDE6" }}>

      {/* Orb décoratif en arrière-plan */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-20%", right: "-10%",
          width: "600px", height: "600px",
          background: "radial-gradient(circle, rgba(217,98,138,0.05) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left */}
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease }}
          >
            <p className="font-sans text-[11px] uppercase tracking-[0.25em] mb-4" style={{ color: "#D9628A" }}>
              Notre équipe
            </p>
            <h2
              className="font-serif font-light leading-[1.05] mb-6"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)", color: "#0D0B08" }}
            >
              Nées pour faire briller
              <span className="font-serif italic" style={{ color: "#F4A8B8" }}> vos fêtes</span>
            </h2>
            <p className="font-sans font-light text-[15px] leading-relaxed mb-5" style={{ color: "rgba(13,11,8,0.62)" }}>
              Event Fiesta, c'est une équipe passionnée basée à Lausanne, spécialisée dans la décoration d'événements depuis 2020. Nous transformons chaque célébration — petite ou grande — en un moment visuel inoubliable.
            </p>
            <p className="font-sans font-light text-[15px] leading-relaxed mb-10" style={{ color: "rgba(13,11,8,0.48)" }}>
              Trois langues, des dizaines de thèmes maîtrisés, et une seule obsession : que vous soyez époustouflée au moment où vous entrez dans la salle.
            </p>

            {/* Stats animés */}
            <div className="grid grid-cols-3 gap-4 mb-10 pt-8 border-t" style={{ borderColor: "rgba(13,11,8,0.12)" }}>
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1, ease }}
                  className="flex flex-col gap-1"
                >
                  <span className="font-serif font-light text-3xl" style={{ color: "#D9628A" }}>
                    {reduce
                      ? `${s.to}${s.suffix}`
                      : <Counter to={s.to} suffix={s.suffix} delay={0.5 + i * 0.1} />
                    }
                  </span>
                  <span className="font-sans text-[10px] uppercase tracking-[0.18em]" style={{ color: "rgba(13,11,8,0.42)" }}>
                    {s.label}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.button
              onClick={() => router.push("/contact")}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8, ease }}
              whileHover={reduce ? {} : { scale: 1.03 }}
              className="font-sans text-[13px] font-medium px-7 py-3 rounded-full cursor-pointer"
              style={{ background: "#F4A8B8", color: "#0D0B08" }}
            >
              Nous contacter
            </motion.button>
          </motion.div>

          {/* Right — value cards */}
          <div className="flex flex-col gap-5">
            {VALUES.map((v, i) => (
              <ValueCard key={v.label} v={v} i={i} inView={inView} reduce={reduce} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
