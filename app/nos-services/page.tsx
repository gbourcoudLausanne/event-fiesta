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
        eyebrow={t.services.eyebrow}
        title={t.services.title}
        subtitle={t.services.intro}
      />
      <ServicesCatalog />
      <ContactCta />
    </>
  );
}
