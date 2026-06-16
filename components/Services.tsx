"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
  animate,
} from "motion/react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import type { ReactNode } from "react";

const serviceImages: Record<string, string> = {
  anniversary:
    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=700&q=80",
  baptism:
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80",
  babyshower:
    "https://images.unsplash.com/photo-1478146059778-26028b07395a?auto=format&fit=crop&w=600&q=80",
  themed:
    "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=700&q=80",
  communion:
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80",
  genderreveal:
    "https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=600&q=80",
  corporate:
    "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=700&q=80",
};

const ease = [0.16, 1, 0.3, 1] as const;

function TiltCard({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-6, 6]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    animate(x, 0, { duration: 0.4, ease: "easeOut" });
    animate(y, 0, { duration: 0.4, ease: "easeOut" });
  };

  return (
    <motion.div
      className={className}
      style={{
        rotateX: reduce ? 0 : rotateX,
        rotateY: reduce ? 0 : rotateY,
        transformPerspective: 900,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}

export function Services() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  return (
    <section id="services" className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease }}
          className="mb-12 lg:mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-noir leading-tight">
            {t.services.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {t.services.items.map((item, i) => (
            <motion.div
              key={item.key}
              initial={reduce ? false : { opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.06, ease }}
              className={i === 0 || i === 6 ? "lg:col-span-2" : "lg:col-span-1"}
            >
              <TiltCard className="group relative overflow-hidden rounded-2xl bg-noir cursor-pointer">
                <div
                  className={`relative w-full ${
                    i === 0 || i === 6 ? "aspect-[16/9]" : "aspect-[4/3]"
                  }`}
                >
                  <Image
                    src={serviceImages[item.key]}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 440px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-noir/80 via-noir/20 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
                  <h3 className="font-serif text-xl lg:text-2xl font-light text-creme leading-tight mb-1">
                    {item.title}
                  </h3>
                  <p className="font-sans text-sm text-creme/70 leading-relaxed opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    {item.desc}
                  </p>
                </div>

                <div className="absolute top-0 left-0 right-0 h-0.5 bg-or scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
