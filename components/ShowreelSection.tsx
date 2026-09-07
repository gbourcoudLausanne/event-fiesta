"use client";

import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";

// Chargement dynamique (client-only, no SSR) — le moteur d'animation utilise rAF/localStorage.
const VideoReel = dynamic(
  () => import("./VideoReel").then(m => m.VideoReel),
  { ssr: false, loading: () => <div style={{ position:'absolute', inset:0, background:'#EDE3D8' }} /> }
);

const ease = [0.16, 1, 0.3, 1] as const;

export function ShowreelSection() {
  const reduce = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  // Ne démarre l'animation que quand la section est visible dans le viewport.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16 lg:py-24" style={{ background: "#F3EDE6" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease }}
          className="mb-10"
        >
          <p className="font-sans text-[11px] uppercase tracking-[0.25em] mb-3" style={{ color: "#D9628A" }}>
            Notre univers
          </p>
          <h2
            className="font-serif font-light leading-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#0D0B08" }}
          >
            15 secondes pour
            <span className="font-serif italic" style={{ color: "#F4A8B8" }}> tout comprendre</span>
          </h2>
        </motion.div>

        {/* Conteneur vidéo 16:9 */}
        <motion.div
          ref={wrapperRef}
          initial={reduce ? false : { opacity: 0, y: 28, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease }}
          className="relative w-full overflow-hidden rounded-2xl"
          style={{
            aspectRatio: "16 / 9",
            boxShadow: "0 24px 60px rgba(13,11,8,0.12), 0 0 0 1px rgba(217,98,138,0.18)",
          }}
        >
          {active ? (
            <VideoReel active={active} />
          ) : (
            /* Placeholder pendant le lazy-load */
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "#EDE3D8" }}
            >
              <div className="flex flex-col items-center gap-3 opacity-30">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="22" stroke="#D9628A" strokeWidth="1.5"/>
                  <path d="M19 16l16 8-16 8V16z" fill="#D9628A"/>
                </svg>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
