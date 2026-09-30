import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Realisations } from "@/components/Realisations";
import { Process } from "@/components/Process";
import { FAQ } from "@/components/FAQ";
import { SoftDivider } from "@/components/SectionDivider";

export default function Home() {
  return (
    <>
      <Hero />

      <Services />
      <SoftDivider from="#FAF7F2" to="#F3EDE6" />

      <Realisations preview />

      <Process />

      <FAQ preview />
    </>
  );
}
