import dynamic from "next/dynamic";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";

const DemoShowcase = dynamic(() =>
  import("@/components/landing/demo-showcase").then((mod) => mod.DemoShowcase)
);
const PricingPreview = dynamic(() =>
  import("@/components/landing/pricing-preview").then((mod) => mod.PricingPreview)
);

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Features />
      <DemoShowcase />
      <PricingPreview />
      <Footer />
    </main>
  );
}
