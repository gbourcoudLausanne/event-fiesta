import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galerie — Nos réalisations · Event Fiesta Lausanne",
  description:
    "Photos de nos décorations d'événements : arches de ballons, murs floraux, sweet tables, gender reveals, décors corporate à Lausanne et en Suisse romande.",
  alternates: { canonical: "https://event-fiesta.ch/galerie" },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
