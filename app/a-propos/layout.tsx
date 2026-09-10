import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos — Event Fiesta · Lausanne",
  description:
    "Event Fiesta — décoration d'événements sur mesure à Lausanne et en Suisse romande. Mon histoire, mes valeurs, un savoir-faire né en Colombie en 2018.",
  alternates: { canonical: "https://event-fiesta.ch/a-propos" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
