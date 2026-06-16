"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      setVisible(false);
      return;
    }
    const t = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[9998] flex items-center justify-center"
          style={{ background: "#0D0B08" }}
          aria-hidden
        >
          {/* Gold shimmer line top */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 left-0 right-0 h-px origin-left"
            style={{ background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }}
          />

          <div className="flex flex-col items-center gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-baseline gap-2"
            >
              <span
                className="font-sans font-light text-4xl tracking-[0.18em] uppercase"
                style={{ color: "#FAF7F2", letterSpacing: "0.22em" }}
              >
                Event
              </span>
              <span
                className="font-serif italic text-5xl font-light"
                style={{ color: "#C9A84C", lineHeight: 1.1 }}
              >
                Fiesta
              </span>
            </motion.div>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="h-px w-24 origin-center"
              style={{ background: "linear-gradient(90deg, transparent, #B08B3A, transparent)" }}
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="font-sans text-[10px] tracking-[0.3em] uppercase"
              style={{ color: "rgba(250,247,242,0.35)" }}
            >
              Lausanne · Suisse Romande
            </motion.p>
          </div>

          {/* Gold shimmer line bottom */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-0 left-0 right-0 h-px origin-right"
            style={{ background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
