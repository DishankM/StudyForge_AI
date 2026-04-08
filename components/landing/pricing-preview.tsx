"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "Rs 0",
    period: "/month",
    badge: "Good for getting started",
    popular: false,
    features: [
      "Upload documents and explore the workflow",
      "Generate study notes",
      "Create MCQ practice sets",
      "Access dashboard and revision tools",
    ],
    cta: "Start Free",
    variant: "outline" as const,
    href: "/auth/signup",
  },
  {
    name: "Student Pro",
    price: "Rs 149",
    period: "/month",
    badge: "Most practical for regular use",
    popular: true,
    features: [
      "Higher usage for uploads and generation",
      "Notes, MCQs, viva, and exam paper workflows",
      "Faster day-to-day revision support",
      "Priority access to growing features",
    ],
    cta: "Start Free Trial",
    variant: "default" as const,
    note: "7-day free trial, cancel anytime",
    href: "/auth/signup",
  },
  {
    name: "Institute",
    price: "Custom",
    period: " pricing",
    badge: "For teams and institutions",
    popular: false,
    features: [
      "Everything in Pro",
      "Shared access for multiple users",
      "Custom templates and workflows",
      "Operational support for larger usage",
    ],
    cta: "Contact Sales",
    variant: "outline" as const,
    href: "#contact",
  },
];

export function PricingPreview() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  const getLoggedInPlanHref = (planName: string) =>
    `/dashboard/settings?tab=billing&plan=${encodeURIComponent(planName)}`;

  const getLoggedInPlanCtaLabel = (planName: string, planCta: string) => {
    // For logged-in users, always route to billing/settings.
    if (planName === "Student Pro") return "Upgrade Plan";
    if (planName === "Free") return "View Billing";
    return planCta;
  };

  return (
    <section id="pricing" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center sm:mb-16"
        >
          <h2 className="mb-4 font-heading text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl">
            Choose a Plan That Fits Your Study Routine
          </h2>
          <p className="mx-auto max-w-xl text-lg text-text-secondary">
            Start free, explore the workflow, and upgrade when you need more daily usage.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid gap-5 md:grid-cols-3 lg:gap-8"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              whileHover={{ y: -4 }}
              className={cn(
                "glass-card relative flex flex-col p-5 sm:p-6 lg:p-8",
                plan.popular && "border-2 border-primary-purple shadow-glow-purple"
              )}
            >
              {plan.popular ? (
                <div className="absolute -top-3 left-1/2 max-w-[90%] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-pink to-primary-purple px-3 py-1 text-center text-[11px] font-medium text-white sm:text-xs">
                  {plan.badge}
                </div>
              ) : (
                <span className="mb-2 block text-sm font-medium text-text-muted">{plan.badge}</span>
              )}
              <h3 className="mb-1 font-heading text-xl font-bold text-text-primary">{plan.name}</h3>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-text-primary">{plan.price}</span>
                <span className="text-text-muted">{plan.period}</span>
              </div>
              <ul className="mb-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm leading-6 text-text-secondary">
                    <Check className="h-5 w-5 shrink-0 text-primary-pink" />
                    {feature}
                  </li>
                ))}
              </ul>
              {plan.note && <p className="mb-4 text-xs text-text-muted">{plan.note}</p>}
              <Button variant={plan.variant} size="lg" className="w-full" asChild>
                <Link
                  href={
                    isLoggedIn && plan.href.startsWith("/auth")
                      ? getLoggedInPlanHref(plan.name)
                      : plan.href
                  }
                >
                  {isLoggedIn && plan.href.startsWith("/auth")
                    ? getLoggedInPlanCtaLabel(plan.name, plan.cta)
                    : plan.cta}
                </Link>
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
