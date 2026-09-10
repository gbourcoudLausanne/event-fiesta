"use client";

import { GalleryHero } from "@/components/GalleryHero";
import { Realisations, GALLERY_WORLDS, GALLERY_PIECES } from "@/components/Realisations";
import { ContactCta } from "@/components/ContactCta";

export default function GalleryPage() {
  return (
    <>
      <GalleryHero worlds={GALLERY_WORLDS} pieces={GALLERY_PIECES} />
      <Realisations />
      <ContactCta />
    </>
  );
}
