import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos — Event Fiesta · Lausanne",
  description:
    "Event Fiesta, équipe passionnée de décoration d'événements à Lausanne depuis 2020. Notre histoire, nos valeurs, notre savoir-faire sur mesure.",
  alternates: { canonical: "https://event-fiesta.ch/a-propos" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
