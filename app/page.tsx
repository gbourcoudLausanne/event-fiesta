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
        {/* dark → cream */}
        <SectionDivider from="#0D0B08" to="#FAF7F2" variant="wave" height={72} />

        <Services />
        {/* cream → blush */}
        <SectionDivider from="#FAF7F2" to="#F5EDE6" variant="diagonal-inv" height={56} />

        <Realisations />
        {/* blush → dark */}
        <SectionDivider from="#F5EDE6" to="#0D0B08" variant="wave-inv" height={72} />

        <WhyUs />
        <Testimonials />
        <CtaBanner />
        {/* dark → cream */}
        <SectionDivider from="#0D0B08" to="#FAF7F2" variant="wave" height={72} />

        <Contact />
        {/* cream → dark footer */}
        <SectionDivider from="#FAF7F2" to="#0D0B08" variant="diagonal" height={56} />
      </main>
      <Footer />
    </>
  );
}
