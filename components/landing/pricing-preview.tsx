"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PLAN_ORDER, getPlanDetails } from "@/lib/plans";

export function PricingPreview() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const plans = PLAN_ORDER.map((planId) => getPlanDetails(planId));

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
                "glass-card relative flex flex-col overflow-hidden p-5 sm:p-6 lg:p-8",
                plan.popular && "border-2 border-primary-purple shadow-glow-purple"
              )}
            >
              <div
                className={cn(
                  "pointer-events-none absolute inset-x-0 top-0 h-32 opacity-30 blur-3xl",
                  `bg-gradient-to-r ${plan.accentClass}`
                )}
              />
              {plan.popular ? (
                <div className="absolute -top-3 left-1/2 max-w-[90%] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-pink to-primary-purple px-3 py-1 text-center text-[11px] font-medium text-white sm:text-xs">
                  {plan.badge}
                </div>
              ) : (
                <span className="mb-2 block text-sm font-medium text-text-muted">{plan.badge}</span>
              )}
              <h3 className="mb-1 font-heading text-xl font-bold text-text-primary">{plan.name}</h3>
              <p className="mb-4 text-sm leading-6 text-text-secondary">{plan.summary}</p>
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
              <Button
                variant={plan.popular ? "default" : "outline"}
                size="lg"
                className={cn(
                  "w-full",
                  plan.popular && "bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-400 hover:to-violet-500"
                )}
                asChild
              >
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
