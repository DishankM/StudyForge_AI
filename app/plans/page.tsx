import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const PricingPreview = dynamic(() =>
  import("@/components/landing/pricing-preview").then((mod) => mod.PricingPreview)
);

export default function PlansPage() {
  return (
    <main className="space-y-6">
      <section className="mx-auto mt-6 max-w-7xl rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">Choose your StudyForge plan</h1>
            <p className="mt-2 text-sm text-gray-300">
              Start free and upgrade only when your daily generation needs increase.
            </p>
          </div>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/auth/signup">Start free trial</Link>
          </Button>
        </div>
      </section>
      <PricingPreview />
    </main>
  );
}

