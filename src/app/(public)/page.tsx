import Hero from "@/components/landing/Hero";
import Problem from "@/components/landing/Problem";
import HowItWorks from "@/components/landing/HowItWorks";
import ValueProps from "@/components/landing/ValueProps";
import WhoItsFor from "@/components/landing/WhoItsFor";
import FounderNote from "@/components/landing/FounderNote";
import FAQ from "@/components/landing/FAQ";
import WaitlistFooter from "@/components/landing/WaitlistFooter";
import Nav from "@/components/landing/Nav";

export default function LandingPage() {
  return (
    <main>
      <Nav/>
      <Hero />
      <Problem />
      <HowItWorks />
      <ValueProps />
      <WhoItsFor />
      <FounderNote />
      <FAQ />
      <WaitlistFooter />
    </main>
  );
}