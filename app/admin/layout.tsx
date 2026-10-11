import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Montserrat, DM_Serif_Display } from "next/font/google";
import "../globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
  title: "Admin — Event Fiesta",
  robots: { index: false, follow: false },
  // Icône "écran d'accueil" : s'ouvre toujours sur la Vue d'ensemble (start_url /admin)
  manifest: "/admin.webmanifest",
  appleWebApp: { capable: true, title: "EF Admin", statusBarStyle: "black-translucent" },
  icons: { apple: "/admin-icons/icon-180.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0D0B08",
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${montserrat.variable} ${dmSerif.variable} antialiased`}>
      <body className="admin-root min-h-screen font-sans" style={{ background: "var(--creme)", color: "var(--noir)" }}>
        {children}
      </body>
    </html>
  );
}
