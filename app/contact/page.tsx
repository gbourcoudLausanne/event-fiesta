import type { Metadata } from "next";
import { Contact } from "@/components/Contact";
import { FAQ } from "@/components/FAQ";
import { SectionDivider } from "@/components/SectionDivider";

export const metadata: Metadata = {
  title: "Contact & devis gratuit — Event Fiesta",
  description:
    "Demandez votre devis gratuit et sans engagement pour la décoration de votre événement à Lausanne et en Suisse romande.",
  alternates: { canonical: "https://eventfiesta.ch/contact" },
};

export default function ContactPage() {
  return (
    <div className="pt-[68px]">
      <Contact />
      <SectionDivider from="#FAF7F2" to="#F3EDE6" variant="wave" height={64} />
      <FAQ />
    </div>
  );
}
