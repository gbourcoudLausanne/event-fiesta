"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -200, y: -200 });
  const current = useRef({ x: -200, y: -200 });
  const raf = useRef<number>(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || typeof window === "undefined") return;
    if (window.innerWidth < 1024) return;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`;
      }
    };

    const animate = () => {
      current.current.x = lerp(current.current.x, pos.current.x, 0.12);
      current.current.y = lerp(current.current.y, pos.current.y, 0.12);
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${current.current.x - 18}px, ${current.current.y - 18}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.style.cursor = "none";

    const onEnter = () => ringRef.current?.classList.add("cursor-ring-hover");
    const onLeave = () => ringRef.current?.classList.remove("cursor-ring-hover");

    const addListeners = () => {
      document.querySelectorAll("a, button, [role='button'], [tabindex]").forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };
    addListeners();

    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.style.cursor = "";
      observer.disconnect();
    };
  }, [reduce]);

  if (reduce) return null;

  return (
    <>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9999] w-9 h-9 rounded-full border border-or/70 pointer-events-none select-none will-change-transform transition-[width,height,margin,border-color,background] duration-200 hidden lg:block"
        aria-hidden
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] w-1.5 h-1.5 rounded-full bg-or pointer-events-none select-none will-change-transform hidden lg:block"
        aria-hidden
      />
    </>
  );
}
