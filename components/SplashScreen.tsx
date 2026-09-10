"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

// ── Ballons ──────────────────────────────────────────────────────────────────
type BalloonDef = {
  x: number; color: string; size: number; dur: number; phase: number; mirror: boolean;
};

const BALLOONS: BalloonDef[] = [
  { x: 2,  color: "#E8749E", size: 32, dur: 14, phase: 0.05, mirror: false },
  { x: 8,  color: "#F4A8B8", size: 22, dur: 18, phase: 0.42, mirror: true  },
  { x: 15, color: "#B98AE8", size: 30, dur: 12, phase: 0.71, mirror: false },
  { x: 22, color: "#E8A688", size: 20, dur: 16, phase: 0.18, mirror: true  },
  { x: 29, color: "#6FC7A0", size: 36, dur: 20, phase: 0.58, mirror: false },
  { x: 36, color: "#E8749E", size: 18, dur: 15, phase: 0.85, mirror: true  },
  { x: 43, color: "#F4A8B8", size: 28, dur: 13, phase: 0.30, mirror: false },
  { x: 50, color: "#E8C870", size: 24, dur: 17, phase: 0.65, mirror: true  },
  { x: 57, color: "#E8749E", size: 30, dur: 19, phase: 0.10, mirror: false },
  { x: 64, color: "#B98AE8", size: 22, dur: 14, phase: 0.48, mirror: true  },
  { x: 71, color: "#6FC7A0", size: 26, dur: 16, phase: 0.78, mirror: false },
  { x: 78, color: "#F4A8B8", size: 20, dur: 21, phase: 0.22, mirror: true  },
  { x: 84, color: "#E8A688", size: 34, dur: 15, phase: 0.55, mirror: false },
  { x: 91, color: "#E8749E", size: 22, dur: 18, phase: 0.90, mirror: true  },
  { x: 5,  color: "#E8C870", size: 18, dur: 22, phase: 0.35, mirror: true  },
  { x: 33, color: "#B98AE8", size: 16, dur: 11, phase: 0.62, mirror: false },
  { x: 60, color: "#E8749E", size: 24, dur: 16, phase: 0.15, mirror: true  },
  { x: 96, color: "#F4A8B8", size: 28, dur: 13, phase: 0.88, mirror: false },
];

function BalloonSVG({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={Math.round(size * 1.85)} viewBox="0 0 30 56" fill="none">
      <ellipse cx="15" cy="15" rx="13" ry="14.5" fill={color} opacity="0.92" stroke="rgba(13,11,8,0.12)" strokeWidth="0.5" />
      <ellipse cx="10" cy="10" rx="3.5" ry="4.5" fill="white" opacity="0.3" transform="rotate(-20 10 10)" />
      <path d="M13 29 Q15 33 17 29" stroke={color} strokeWidth="1.5" fill={color} opacity="0.92" />
      <path d="M15 33 Q13 39 15 45 Q17 50 15 56" stroke="rgba(13,11,8,0.25)" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}

function FloatingBalloons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {BALLOONS.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            bottom: 0,
            left: `${b.x}%`,
            animationName: b.mirror ? "balloon-float-r" : "balloon-float",
            animationDuration: `${b.dur}s`,
            animationTimingFunction: "linear",
            animationDelay: `${-b.phase * b.dur}s`,
            animationIterationCount: "infinite",
            willChange: "transform",
          }}
        >
          <BalloonSVG color={b.color} size={b.size} />
        </div>
      ))}
    </div>
  );
}

// ── Splash Screen ────────────────────────────────────────────────────────────
const SEEN_KEY = "ef-splash-seen";

export function SplashScreen() {
  // Démarre masqué : on n'affiche le splash que si on ne l'a pas déjà vu
  // dans cette session (évite de le resubir à chaque visite / navigation).
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    try {
      if (sessionStorage.getItem(SEEN_KEY) === "1") return;
    } catch {}
    const raf = requestAnimationFrame(() => setVisible(true));
    const t = setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {}
    }, 2800);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [reduce]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[9998] flex items-center justify-center overflow-hidden"
          style={{ background: "#FAF7F2" }}
          aria-hidden
          /* ── Zoom-through exit : fond qui fonce vers toi ── */
          exit={{
            scale: 1.45,
            opacity: 0,
            filter: "blur(10px)",
            transition: { duration: 0.72, ease: [0.4, 0, 1, 1] },
          }}
        >
          {/* Ballons */}
          {!reduce && <FloatingBalloons />}

          {/* Ligne dorée haut */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 left-0 right-0 h-px origin-left"
            style={{ background: "linear-gradient(90deg, transparent, #F4A8B8, transparent)" }}
          />

          {/* Contenu — logo qui s'envole vers le haut à l'exit */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-4"
            exit={{
              y: -70,
              opacity: 0,
              scale: 1.08,
              transition: { duration: 0.38, ease: [0.4, 0, 1, 1] },
            }}
          >
            {/* Logo Event Fiesta */}
            <motion.div
              initial={{ opacity: 0, y: 24, filter: "blur(14px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.95, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4"
            >
              {/* Ballon doré — plus grand pour le splash */}
              <svg width="32" height="54" viewBox="0 0 18 30" fill="none" aria-hidden>
                <defs>
                  <linearGradient id="splashGold" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#F2879E" />
                    <stop offset="100%" stopColor="#C24B72" />
                  </linearGradient>
                </defs>
                <ellipse cx="9" cy="9" rx="7.8" ry="8.6" fill="url(#splashGold)" />
                <ellipse cx="5.8" cy="5.5" rx="2" ry="2.8" fill="white" opacity="0.3" transform="rotate(-18 5.8 5.5)" />
                <path d="M7.4 17.6 Q9 20.2 10.6 17.6" stroke="url(#splashGold)" strokeWidth="1.1" fill="url(#splashGold)" strokeLinecap="round" />
                <path d="M9 20.5 Q7.5 24 9 27.5 Q10 29.5 9 30" stroke="#C24B72" strokeWidth="0.65" strokeLinecap="round" fill="none" opacity="0.5" />
              </svg>

              <div className="flex items-baseline gap-2">
                <span
                  className="font-sans font-light text-4xl uppercase"
                  style={{ color: "#0D0B08", letterSpacing: "0.22em" }}
                >
                  Event
                </span>
                <span
                  className="font-serif italic text-5xl font-light"
                  style={{ color: "#D9628A", lineHeight: 1.1 }}
                >
                  Fiesta
                </span>
              </div>
            </motion.div>

            {/* Trait or */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="h-px w-24 origin-center"
              style={{ background: "linear-gradient(90deg, transparent, #D9628A, transparent)" }}
            />

            {/* Lausanne */}
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-[10px] tracking-[0.3em] uppercase"
              style={{ color: "rgba(13,11,8,0.45)" }}
            >
              Lausanne · Suisse Romande
            </motion.p>
          </motion.div>

          {/* Ligne dorée bas */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-0 left-0 right-0 h-px origin-right"
            style={{ background: "linear-gradient(90deg, transparent, #F4A8B8, transparent)" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
