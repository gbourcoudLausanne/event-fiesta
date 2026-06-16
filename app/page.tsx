import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Realisations } from "@/components/Realisations";
import { WhyUs } from "@/components/WhyUs";
import { Testimonials } from "@/components/Testimonials";
import { CtaBanner } from "@/components/CtaBanner";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SectionDivider } from "@/components/SectionDivider";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        {/* blanc → crème */}
        <SectionDivider from="#FEFDF8" to="#FAF7F2" variant="wave" height={48} />

        <Services />
        {/* crème → blush */}
        <SectionDivider from="#FAF7F2" to="#F5E6E0" variant="diagonal-inv" height={56} />

        <Realisations />
        {/* blush → dark */}
        <SectionDivider from="#F5E6E0" to="#0D0B08" variant="wave-inv" height={72} />

        <WhyUs />
        {/* dark → blanc */}
        <SectionDivider from="#0D0B08" to="#FEFDF8" variant="wave" height={72} />

        <Testimonials />
        {/* blanc → blush */}
        <SectionDivider from="#FEFDF8" to="#F5E6E0" variant="diagonal" height={56} />

        <CtaBanner />
        {/* blush → crème */}
        <SectionDivider from="#F5E6E0" to="#FAF7F2" variant="wave-inv" height={48} />

        <Contact />
        {/* crème → dark footer */}
        <SectionDivider from="#FAF7F2" to="#0D0B08" variant="diagonal" height={56} />
      </main>
      <Footer />
    </>
  );
}
