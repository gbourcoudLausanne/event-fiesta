"use client";

import { PageHero } from "@/components/PageHero";
import { Realisations } from "@/components/Realisations";
import { ContactCta } from "@/components/ContactCta";
import { useI18n } from "@/lib/i18n";

export default function GalleryPage() {
  const { t } = useI18n();

  return (
    <>
      <PageHero
        centered
        tone="rose"
        eyebrow={t.realisations.heroEyebrow}
        title={t.realisations.heroTitle}
        subtitle={t.realisations.heroText}
        cta={{ label: t.realisations.heroCta, href: "/contact" }}
      />
      <Realisations />
      <ContactCta />
    </>
  );
}
