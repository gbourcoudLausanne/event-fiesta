import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Realisations } from "@/components/Realisations";
import { ShowreelSection } from "@/components/ShowreelSection";
import { Testimonials } from "@/components/Testimonials";
import { CtaBanner } from "@/components/CtaBanner";
import { FAQ } from "@/components/FAQ";
import { SectionDivider } from "@/components/SectionDivider";

export default function Home() {
  return (
    <>
      <Hero />

      <Services preview />
      {/* crème → crème-2 */}
      <SectionDivider from="#FAF7F2" to="#F3EDE6" variant="diagonal-inv" height={56} />

      <Realisations preview />

      <ShowreelSection />
      <Testimonials />
      <CtaBanner />
      <FAQ preview />
    </>
  );
}
