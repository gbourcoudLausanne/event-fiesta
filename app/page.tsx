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
        {/* encre → crème */}
        <SectionDivider from="#080605" to="#FAF7F2" variant="wave" height={72} />

        <Services />
        {/* crème → encre */}
        <SectionDivider from="#FAF7F2" to="#080605" variant="diagonal-inv" height={56} />

        <Realisations />
        {/* encre → encre (continuous dark zone) */}

        <WhyUs />
        <Testimonials />
        <CtaBanner />
        {/* encre → crème */}
        <SectionDivider from="#0D0B08" to="#FAF7F2" variant="wave" height={72} />

        <Contact />
        {/* crème → encre footer */}
        <SectionDivider from="#FAF7F2" to="#0D0B08" variant="diagonal" height={56} />
      </main>
      <Footer />
    </>
  );
}
