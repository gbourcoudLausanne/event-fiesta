"use client";

import { PageHero } from "@/components/PageHero";
import { ServicesCatalog } from "@/components/ServicesCatalog";
import { Process } from "@/components/Process";
import { CtaBanner } from "@/components/CtaBanner";
import { useI18n } from "@/lib/i18n";

export default function ServicesPage() {
  const { t } = useI18n();

  return (
    <>
      <PageHero
        eyebrow={t.services.eyebrow}
        title={t.services.title}
        subtitle={t.services.intro}
      />
      <ServicesCatalog />
      <Process />
      <CtaBanner />
    </>
  );
}
