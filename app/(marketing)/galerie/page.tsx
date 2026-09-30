"use client";

import { GalleryHero } from "@/components/GalleryHero";
import { Realisations, GALLERY_WORLDS, GALLERY_PIECES } from "@/components/Realisations";
import { ContactCta } from "@/components/ContactCta";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";

export default function GalleryPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Accueil", url: "https://eventfiesta.ch/" },
          { name: "Galerie", url: "https://eventfiesta.ch/galerie" },
        ]}
      />
      <GalleryHero worlds={GALLERY_WORLDS} pieces={GALLERY_PIECES} />
      <Realisations />
      <ContactCta />
    </>
  );
}
