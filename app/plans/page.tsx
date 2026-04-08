import dynamic from "next/dynamic";

const PricingPreview = dynamic(() =>
  import("@/components/landing/pricing-preview").then((mod) => mod.PricingPreview)
);

export default function PlansPage() {
  return (
    <main>
      <PricingPreview />
    </main>
  );
}

