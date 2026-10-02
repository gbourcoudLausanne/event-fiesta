import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // S'assure que les polices utilisées pour générer les PDF (chargées via
  // fs/path à l'exécution, pas via import) sont bien incluses dans le
  // bundle de la fonction serverless.
  outputFileTracingIncludes: {
    "/api/devis/*/pdf": ["./lib/pdf/fonts/**"],
    "/api/factures/*/pdf": ["./lib/pdf/fonts/**"],
  },
};

export default nextConfig;
