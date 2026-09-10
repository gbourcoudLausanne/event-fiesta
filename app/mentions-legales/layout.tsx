import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales — Event Fiesta",
  description:
    "Mentions légales du site Event Fiesta : éditeur, hébergement, propriété intellectuelle et gestion des données personnelles.",
  alternates: { canonical: "https://event-fiesta.ch/mentions-legales" },
};

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
