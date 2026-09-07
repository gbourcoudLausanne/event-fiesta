"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { GarlandDivider } from "@/components/GarlandDivider";

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  );
}
function PinterestIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.428 1.808-2.428.852 0 1.265.64 1.265 1.408 0 .858-.546 2.14-.828 3.33-.236.995.499 1.806 1.476 1.806 1.771 0 3.135-1.867 3.135-4.56 0-2.385-1.714-4.052-4.161-4.052-2.834 0-4.498 2.126-4.498 4.322 0 .856.33 1.773.741 2.273a.3.3 0 01.069.286c-.076.31-.243.995-.276 1.134-.044.183-.146.222-.337.134C5.93 14.47 5 12.876 5 11.036 5 8.226 7.12 5.01 11.854 5.01 15.666 5.01 18.59 7.69 18.59 11.6c0 4.08-2.572 7.36-6.139 7.36-1.2 0-2.329-.624-2.717-1.36l-.739 2.757c-.268 1.03-1 2.32-1.487 3.105C8.61 23.908 10.29 24 12 24c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
    </svg>
  );
}

export function Footer() {
  const { t } = useI18n();

  const footerLinks: [string, string][] = [
    ["/a-propos", t.nav.about],
    ["/nos-services", t.nav.services],
    ["/galerie", t.nav.gallery],
    ["/contact", t.nav.contact],
  ];

  const socials = [
    { href: t.footer.social.instagram, icon: <InstagramIcon />, label: "Instagram" },
    { href: t.footer.social.facebook, icon: <FacebookIcon />, label: "Facebook" },
    { href: t.footer.social.pinterest, icon: <PinterestIcon />, label: "Pinterest" },
  ];

  return (
    <footer style={{ background: "#F3EDE6" }}>
      {/* Guirlande de ballons animée */}
      <GarlandDivider bg="#F3EDE6" />

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="flex items-baseline gap-2 mb-3 cursor-pointer"
              aria-label="Event Fiesta — Accueil"
            >
              <span
                className="font-sans font-medium text-2xl tracking-[0.12em] uppercase"
                style={{ color: "#0D0B08" }}
              >
                Event
              </span>
              <span className="font-serif italic text-3xl font-light" style={{ color: "#F4A8B8" }}>
                Fiesta
              </span>
            </Link>
            <p className="font-sans text-xs mb-6" style={{ color: "rgba(13,11,8,0.42)", letterSpacing: "0.1em" }}>
              {t.footer.tagline}
            </p>
            <p className="font-sans text-sm leading-relaxed mb-8 max-w-xs" style={{ color: "rgba(13,11,8,0.5)" }}>
              Spécialistes de la décoration d&rsquo;événements sur mesure à Lausanne et en Suisse romande depuis 2020.
            </p>

            {/* Social icons */}
            <div className="flex gap-3">
              {socials.map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-250 cursor-pointer"
                  style={{ border: "1px solid rgba(217,98,138,0.3)", color: "rgba(13,11,8,0.55)" }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = "#D9628A";
                    el.style.color = "#0D0B08";
                    el.style.background = "rgba(217,98,138,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = "rgba(217,98,138,0.3)";
                    el.style.color = "rgba(13,11,8,0.55)";
                    el.style.background = "transparent";
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p
              className="font-sans text-[10px] uppercase tracking-[0.2em] mb-5"
              style={{ color: "rgba(217,98,138,0.7)" }}
            >
              Navigation
            </p>
            <ul className="flex flex-col gap-3">
              {footerLinks.map(([href, label]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-sans text-sm font-light transition-colors duration-200 cursor-pointer"
                    style={{ color: "rgba(13,11,8,0.5)" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#0D0B08")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(13,11,8,0.5)")}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <p
              className="font-sans text-[10px] uppercase tracking-[0.2em] mb-5"
              style={{ color: "rgba(217,98,138,0.7)" }}
            >
              Contact
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="tel:0779143855"
                className="font-sans text-sm font-light transition-colors duration-200"
                style={{ color: "rgba(13,11,8,0.5)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#F4A8B8")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(13,11,8,0.5)")}
              >
                077 914 38 55
              </a>
              <a
                href="mailto:contact@eventfiesta.ch"
                className="font-sans text-sm font-light transition-colors duration-200"
                style={{ color: "rgba(13,11,8,0.5)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#F4A8B8")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(13,11,8,0.5)")}
              >
                contact@eventfiesta.ch
              </a>
              <p className="font-sans text-sm font-light" style={{ color: "rgba(13,11,8,0.4)" }}>
                {t.footer.location}
              </p>
            </div>

            {/* CTA */}
            <Link
              href="/contact"
              className="btn-gold-shimmer mt-8 inline-block font-sans text-xs font-medium px-5 py-2.5 rounded-full cursor-pointer transition-all duration-300"
              style={{ background: "rgba(217,98,138,0.15)", color: "#F4A8B8", border: "1px solid rgba(217,98,138,0.3)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "#D9628A";
                (e.currentTarget as HTMLAnchorElement).style.color = "#0D0B08";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(217,98,138,0.15)";
                (e.currentTarget as HTMLAnchorElement).style.color = "#F4A8B8";
              }}
            >
              {t.nav.cta}
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-14 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderColor: "rgba(217,98,138,0.1)" }}
        >
          <p className="font-sans text-xs" style={{ color: "rgba(13,11,8,0.35)" }}>
            {t.footer.copyright}
          </p>
          <div className="flex items-center gap-6">
            <button
              className="font-sans text-xs transition-colors duration-200 cursor-pointer"
              style={{ color: "rgba(13,11,8,0.35)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(13,11,8,0.65)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(13,11,8,0.35)")}
            >
              {t.footer.legal}
            </button>
            <span style={{ color: "rgba(13,11,8,0.2)", fontSize: 10 }}>·</span>
            <p className="font-sans text-xs" style={{ color: "rgba(13,11,8,0.3)" }}>
              Lausanne · Suisse romande
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
