import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nos services — Décoration particuliers & entreprises · Event Fiesta",
  description:
    "Décoration sur mesure pour particuliers (anniversaires, baptêmes, baby showers, soirées à thème) et professionnels (séminaires, soirées d'entreprise, lancements) à Lausanne et en Suisse romande.",
  alternates: { canonical: "https://event-fiesta.ch/nos-services" },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
