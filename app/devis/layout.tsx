import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat, DM_Serif_Display } from "next/font/google";
import "../globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-dm-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Votre devis — Event Fiesta",
  robots: { index: false, follow: false },
};

export default function DevisPublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${montserrat.variable} ${dmSerif.variable} antialiased`}>
      <body className="min-h-screen font-sans" style={{ background: "var(--creme)", color: "var(--noir)" }}>
        {children}
      </body>
    </html>
  );
}
