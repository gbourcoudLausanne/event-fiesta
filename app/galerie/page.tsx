"use client";

import { PageHero } from "@/components/PageHero";
import { Realisations } from "@/components/Realisations";
import { CtaBanner } from "@/components/CtaBanner";
import { useI18n } from "@/lib/i18n";

export default function GalleryPage() {
  const { t } = useI18n();

  return (
    <>
      <PageHero
        eyebrow={t.realisations.eyebrow}
        title={t.realisations.title}
        subtitle={t.realisations.subtitle}
      />
      <Realisations />
      <CtaBanner />
    </>
  );
}
