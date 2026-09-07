import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Realisations } from "@/components/Realisations";
import { Process } from "@/components/Process";
import { Testimonials } from "@/components/Testimonials";
import { CtaBanner } from "@/components/CtaBanner";
import { FAQ } from "@/components/FAQ";
import { GarlandDivider } from "@/components/GarlandDivider";

export default function Home() {
  return (
    <>
      <Hero />

      <Services />
      <GarlandDivider from="#FAF7F2" to="#F3EDE6" variant="warm" />

      <Realisations preview />

      <Process />

      <Testimonials />
      <CtaBanner />
      <FAQ preview />
    </>
  );
}
