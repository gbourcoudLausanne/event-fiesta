"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} étoiles`}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.6 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          style={{ color: "#C9A84C", fontSize: 14 }}
          aria-hidden
        >
          ★
        </motion.span>
      ))}
    </div>
  );
}

const AVATAR_COLORS = ["#4A3728", "#2D3B2E", "#2B3550", "#3D2B4A"];

function Avatar({ name, index }: { name: string; index: number }) {
  const initials = name
    .split(/[\s&]+/)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return (
    <div
      className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
      style={{ background: AVATAR_COLORS[index % AVATAR_COLORS.length], border: "1px solid rgba(176,139,58,0.3)" }}
    >
      <span className="font-sans text-xs font-medium" style={{ color: "#C9A84C" }}>
        {initials}
      </span>
    </div>
  );
}

export function Testimonials() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const { scrollLeft: sl, scrollWidth, clientWidth } = track;
      const totalScrollable = scrollWidth - clientWidth;
      if (totalScrollable <= 0) return;
      const idx = Math.round((sl / totalScrollable) * (t.testimonials.items.length - 1));
      setActiveDot(Math.max(0, Math.min(idx, t.testimonials.items.length - 1)));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [t.testimonials.items.length]);

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (trackRef.current?.offsetLeft ?? 0));
    setScrollLeft(trackRef.current?.scrollLeft ?? 0);
  };
  const onMouseLeave = () => setIsDragging(false);
  const onMouseUp = () => setIsDragging(false);
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX) * 1.6;
    trackRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="py-24 lg:py-32" style={{ background: "#0D0B08" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease }}
          className="mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >
          <div>
            <p className="font-sans text-[11px] uppercase tracking-[0.28em] mb-2" style={{ color: "#B08B3A" }}>
              {t.testimonials.eyebrow}
            </p>
            <h2
              className="font-serif font-light"
              style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#FAF7F2" }}
            >
              {t.testimonials.title}
            </h2>
          </div>
          <p className="font-sans text-xs" style={{ color: "rgba(250,247,242,0.3)", letterSpacing: "0.05em" }}>
            Glissez pour voir plus →
          </p>
        </motion.div>

        {/* Draggable carousel */}
        <div
          ref={trackRef}
          className="no-scrollbar flex gap-5 overflow-x-auto pb-4 select-none"
          style={{
            cursor: isDragging ? "grabbing" : "grab",
          }}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
        >
          {t.testimonials.items.map((item, i) => (
            <motion.div
              key={i}
              initial={reduce ? false : { opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.65, delay: i * 0.1, ease }}
              className="glass-card rounded-2xl p-7 flex-shrink-0 flex flex-col gap-5"
              style={{
                width: "clamp(300px, 80vw, 400px)",
                borderColor: "rgba(176,139,58,0.12)",
              }}
            >
              {/* Stars */}
              <StarRating count={item.rating} />

              {/* Quote */}
              <div className="relative flex-1">
                <span
                  className="absolute -top-3 -left-1 font-serif text-5xl leading-none"
                  style={{ color: "rgba(176,139,58,0.25)" }}
                  aria-hidden
                >
                  "
                </span>
                <p
                  className="font-serif font-light italic text-base lg:text-lg leading-relaxed pt-3"
                  style={{ color: "rgba(250,247,242,0.75)" }}
                >
                  {item.text}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px" style={{ background: "rgba(176,139,58,0.15)" }} />

              {/* Author */}
              <div className="flex items-center gap-3">
                <Avatar name={item.name} index={i} />
                <div>
                  <p className="font-sans text-sm font-medium" style={{ color: "#FAF7F2" }}>
                    {item.name}
                  </p>
                  <p className="font-sans text-xs" style={{ color: "rgba(250,247,242,0.38)" }}>
                    {item.event} · {item.location}
                  </p>
                </div>
                {/* Gold accent */}
                <div className="ml-auto shrink-0">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(176,139,58,0.15)" }}
                  >
                    <span style={{ color: "#C9A84C", fontSize: 10 }}>✓</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* CTA card at end */}
          <motion.div
            initial={reduce ? false : { opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65, delay: 0.5, ease }}
            className="rounded-2xl p-7 flex-shrink-0 flex flex-col items-center justify-center gap-5 text-center"
            style={{
              width: "clamp(260px, 60vw, 320px)",
              border: "1px dashed rgba(176,139,58,0.3)",
              background: "rgba(176,139,58,0.04)",
            }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: "rgba(176,139,58,0.12)", border: "1px solid rgba(176,139,58,0.3)" }}
            >
              <span style={{ color: "#C9A84C", fontSize: 22 }}>★</span>
            </div>
            <p className="font-serif font-light italic text-xl" style={{ color: "rgba(250,247,242,0.6)" }}>
              Votre avis compte
            </p>
            <p className="font-sans text-sm" style={{ color: "rgba(250,247,242,0.35)" }}>
              Partagez votre expérience avec Event Fiesta
            </p>
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="font-sans text-xs font-medium px-5 py-2.5 rounded-full cursor-pointer transition-colors duration-200"
              style={{ background: "#B08B3A", color: "#0D0B08" }}
            >
              Nous contacter
            </button>
          </motion.div>
        </div>

        {/* Dots indicator — réactifs au scroll */}
        <div className="flex gap-2 justify-center mt-8">
          {t.testimonials.items.map((_, i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: i === activeDot ? 24 : 6,
                height: 6,
                background: i === activeDot ? "#B08B3A" : "rgba(176,139,58,0.25)",
                transition: "width 0.3s ease, background 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
