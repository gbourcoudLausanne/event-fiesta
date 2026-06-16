"use client";

import { useEffect, useRef } from "react";
import { useScroll, useSpring, useReducedMotion } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    return scaleX.on("change", (v) => {
      if (ref.current) ref.current.style.transform = `scaleX(${v})`;
    });
  }, [scaleX, reduce]);

  if (reduce) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: "#B08B3A",
        zIndex: 9996,
        pointerEvents: "none",
        transformOrigin: "0% 50%",
        transform: "scaleX(0)",
      }}
    />
  );
}
