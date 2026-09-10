"use client";

import { PageHero } from "@/components/PageHero";
import { ServicesCatalog } from "@/components/ServicesCatalog";
import { ContactCta } from "@/components/ContactCta";
import { useI18n } from "@/lib/i18n";

export default function ServicesPage() {
  const { t } = useI18n();

  return (
    <>
      <PageHero
        centered
        eyebrow={t.services.heroEyebrow}
        title={t.services.heroTitle}
        subtitle={t.services.heroText}
        cta={{ label: t.about.cta, href: "/contact" }}
      />
      <ServicesCatalog />
      <ContactCta />
    </>
  );
}
