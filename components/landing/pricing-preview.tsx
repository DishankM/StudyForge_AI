"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "/month",
    badge: "Perfect to start",
    popular: false,
    features: [
      "3 document uploads/month",
      "Basic notes generation",
      "50 MCQs/month",
      "Standard format",
      "Email support",
    ],
    cta: "Start Free",
    variant: "outline" as const,
    href: "/auth/signup",
  },
  {
    name: "Student Pro",
    price: "₹149",
    period: "/month",
    badge: "Most popular",
    popular: true,
    features: [
      "Unlimited uploads",
      "Advanced AI notes",
      "Unlimited MCQs",
      "All exam paper formats",
      "Viva questions",
      "Revision planner",
      "Priority support",
      "Download as PDF/DOCX",
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
    badge: "For colleges & coaching",
    popular: false,
    features: [
      "Everything in Pro",
      "Multi-user access",
      "White-label option",
      "Custom templates",
      "Bulk processing",
      "API access",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    variant: "outline" as const,
    href: "#contact",
  },
];

export function PricingPreview() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  return (
    <section id="pricing" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-text-primary mb-4">
            Choose Your Plan
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Start free, upgrade anytime. No credit card required.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 lg:gap-8"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              whileHover={{ y: -4 }}
              className={cn(
                "glass-card p-6 lg:p-8 flex flex-col relative",
                plan.popular && "border-2 border-primary-purple shadow-glow-purple"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-primary-pink to-primary-purple text-white text-xs font-medium">
                  {plan.badge}
                </div>
              )}
              {!plan.popular && (
                <span className="text-text-muted text-sm font-medium mb-2 block">
                  {plan.badge}
                </span>
              )}
              <h3 className="font-heading font-bold text-xl text-text-primary mb-1">
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-bold text-text-primary">
                  {plan.price}
                </span>
                <span className="text-text-muted">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-text-secondary text-sm"
                  >
                    <Check className="w-5 h-5 text-primary-pink shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              {plan.note && (
                <p className="text-text-muted text-xs mb-4">{plan.note}</p>
              )}
              {!isLoggedIn || !plan.href.startsWith("/auth") ? (
                <Button
                  variant={plan.variant}
                  size="lg"
                  className="w-full"
                  asChild
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              ) : null}
            </motion.div>
          ))}
        </motion.div>

        <p className="text-center text-text-muted text-sm mt-8">
          <Link href="#compare" className="text-primary-pink hover:underline">
            Compare all features →
          </Link>
        </p>
      </div>
    </section>
  );
}
