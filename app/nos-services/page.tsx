"use client";

import { PageHero } from "@/components/PageHero";
import { ServicesCatalog } from "@/components/ServicesCatalog";
import { HowItWorks } from "@/components/HowItWorks";
import { CtaBanner } from "@/components/CtaBanner";
import { SectionDivider } from "@/components/SectionDivider";
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
      <SectionDivider from="#F3EDE6" to="#FAF7F2" variant="diagonal-inv" height={56} />
      <HowItWorks />
      <SectionDivider from="#FAF7F2" to="#F3EDE6" variant="wave" height={64} />
      <CtaBanner />
    </>
  );
}
