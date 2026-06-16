"use client";

import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-noir py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          {/* Logo block */}
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-sans font-bold text-creme text-xl tracking-tight">
                Event
              </span>
              <span className="font-serif italic text-or text-[1.45rem] leading-[1.1] pb-0.5">
                Fiesta
              </span>
            </div>
            <p className="font-sans text-xs text-creme/30 tracking-wide">
              {t.footer.tagline}
            </p>
            <p className="font-sans text-xs text-creme/30">
              {t.footer.location}
            </p>
          </div>

          {/* Nav links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-col gap-3">
              {(
                [
                  ["services", t.footer.links.services],
                  ["realisations", t.footer.links.realisations],
                  ["contact", t.footer.links.contact],
                ] as const
              ).map(([id, label]) => (
                <li key={id}>
                  <button
                    onClick={() => scrollTo(id)}
                    className="font-sans text-sm text-creme/40 hover:text-creme/80 transition-colors cursor-pointer"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* CTA block */}
          <div className="flex flex-col gap-4">
            <p className="font-sans text-xs text-creme/30 uppercase tracking-wide">
              Un projet en tête ?
            </p>
            <a
              href="mailto:contact@eventfiesta.ch"
              className="font-sans text-sm text-or hover:text-creme/80 transition-colors"
            >
              contact@eventfiesta.ch
            </a>
            <a
              href="tel:0779143855"
              className="font-sans text-sm text-creme/40 hover:text-creme/80 transition-colors"
            >
              077 914 38 55
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-creme/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="font-sans text-xs text-creme/25">
            {t.footer.copyright}
          </p>
          <p className="font-sans text-xs text-creme/25">
            Lausanne · Suisse romande
          </p>
        </div>
      </div>
    </footer>
  );
}
