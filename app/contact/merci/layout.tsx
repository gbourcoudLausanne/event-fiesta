import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demande envoyée — Event Fiesta",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://event-fiesta.ch/contact/merci" },
};

export default function MerciLayout({ children }: { children: React.ReactNode }) {
  return children;
}
