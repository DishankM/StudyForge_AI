import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ProcessFlow } from "@/components/landing/process-flow";
import { Features } from "@/components/landing/features";
import { Benefits } from "@/components/landing/benefits";
import { DemoShowcase } from "@/components/landing/demo-showcase";
import { Testimonials } from "@/components/landing/testimonials";
import { PricingPreview } from "@/components/landing/pricing-preview";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <ProcessFlow />
      <Features />
      <Benefits />
      <DemoShowcase />
      <Testimonials />
      <PricingPreview />
      <CtaSection />
      <Footer />
    </main>
  );
}
