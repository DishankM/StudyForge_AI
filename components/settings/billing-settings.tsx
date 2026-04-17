"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  Gauge,
  Layers3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  PLAN_ORDER,
  formatUsageLimit,
  formatUsageValue,
  getPlanDetails,
  getUsageProgress,
  normalizePlan,
  type PlanId,
} from "@/lib/plans";
import { cn } from "@/lib/utils";

type BillingSettingsProps = {
  user: {
    plan?: string | null;
  };
  usage: {
    uploads: number;
    notes: number;
    mcqs: number;
    viva: number;
    examPapers: number;
    roadmaps: number;
  };
  razorpayStatus: {
    configured: boolean;
    missing: readonly string[];
  };
};

const usageLabels = {
  uploads: "Document uploads",
  notes: "Notes",
  mcqs: "MCQ sets",
  viva: "Viva sets",
  examPapers: "Exam papers",
  roadmaps: "Roadmaps",
} as const;

export function BillingSettings({ user, usage, razorpayStatus }: BillingSettingsProps) {
  const currentPlan = normalizePlan(user.plan);
  const currentPlanDetails = getPlanDetails(currentPlan);
  const plans = PLAN_ORDER.map((planId) => getPlanDetails(planId));

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden rounded-[28px] border-white/10 bg-zinc-950/90 shadow-[0_25px_80px_rgba(0,0,0,0.28)]">
        <div className="relative overflow-hidden border-b border-white/10 p-5 sm:p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.22),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.16),_transparent_32%)]" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-sm font-medium text-pink-200">
                <CreditCard className="h-4 w-4" />
                Plan and billing
              </div>
              <h2 className="mt-5 text-2xl font-semibold text-white sm:text-3xl">{currentPlanDetails.name}</h2>
              <p className="mt-2 max-w-xl text-sm leading-7 text-gray-300 sm:text-base">
                {currentPlanDetails.summary}
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/20 p-5 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-gray-500">Current billing</p>
              <p className="mt-3 text-3xl font-semibold text-white">
                {currentPlanDetails.price}
                <span className="ml-1 text-base font-normal text-gray-400">{currentPlanDetails.period}</span>
              </p>
              <p className="mt-2 text-sm text-gray-400">
                {currentPlan === "FREE"
                  ? "Upgrade when you need more study capacity."
                  : currentPlan === "INSTITUTE"
                  ? "Institutional billing is handled as a custom contract."
                  : "Student Pro is aligned for monthly self-serve billing."}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[28px] border-white/10 bg-zinc-950/85 p-5 shadow-[0_25px_80px_rgba(0,0,0,0.24)] sm:p-6">
          <div className="mb-5 flex items-center gap-2 text-white">
            <Gauge className="h-4 w-4 text-cyan-300" />
            <h3 className="font-semibold">Usage this month</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(usageLabels).map(([feature, label]) => {
              const typedFeature = feature as keyof typeof usage;
              const limit = currentPlanDetails.limits[typedFeature];
              const used = usage[typedFeature];
              const progress = getUsageProgress(used, limit);

              return (
                <div
                  key={feature}
                  className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-4"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-sm text-gray-400">{label}</span>
                    <span className="text-sm font-semibold text-white">{formatUsageValue(used, limit)}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-800">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-3 text-xs leading-5 text-gray-500">Plan cap: {formatUsageLimit(limit)}</p>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="rounded-[28px] border-white/10 bg-zinc-950/85 p-5 shadow-[0_25px_80px_rgba(0,0,0,0.24)] sm:p-6">
          <div className="mb-5 flex items-center gap-2 text-white">
            <Layers3 className="h-4 w-4 text-emerald-300" />
            <h3 className="font-semibold">Razorpay integration status</h3>
          </div>

          <div
            className={cn(
              "rounded-3xl border p-4",
              razorpayStatus.configured
                ? "border-emerald-500/20 bg-emerald-500/10"
                : "border-amber-500/20 bg-amber-500/10"
            )}
          >
            <div className="flex items-start gap-3">
              <ShieldCheck
                className={cn("mt-0.5 h-5 w-5", razorpayStatus.configured ? "text-emerald-300" : "text-amber-300")}
              />
              <div>
                <p className="font-medium text-white">
                  {razorpayStatus.configured ? "Environment ready" : "Environment still pending"}
                </p>
                <p className="mt-1 text-sm leading-6 text-gray-300">
                  {razorpayStatus.configured
                    ? "The app has the Razorpay keys needed for secure server-side billing flows."
                    : "Add your Razorpay keys before wiring live checkout, signature verification, and renewals."}
                </p>
                {!razorpayStatus.configured && (
                  <p className="mt-2 text-xs text-amber-100/80">
                    Missing: {razorpayStatus.missing.join(", ")}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-3 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-sm font-medium text-white">Recommended rollout</p>
            <div className="space-y-3 text-sm leading-6 text-gray-400">
              <p>1. Create a Student Pro plan in Razorpay Subscriptions and store the plan id in env.</p>
              <p>2. Build a server route that creates a subscription for the signed-in user and returns checkout data.</p>
              <p>3. Add a webhook route to verify signatures and update `user.plan` only after payment events succeed.</p>
              <p>4. Store subscription id, payment id, status, next billing date, and invoices in new billing tables.</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="rounded-[28px] border-white/10 bg-zinc-950/85 p-5 shadow-[0_25px_80px_rgba(0,0,0,0.24)] sm:p-6">
        <div className="mb-5 flex items-center gap-2 text-white">
          <Sparkles className="h-4 w-4 text-pink-300" />
          <h3 className="font-semibold">Choose your plan</h3>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlan;

            return (
              <div
                key={plan.id}
                className={cn(
                  "relative overflow-hidden rounded-[26px] border p-5",
                  isCurrent
                    ? "border-pink-500/40 bg-[linear-gradient(180deg,rgba(236,72,153,0.14),rgba(17,24,39,0.9))]"
                    : "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]"
                )}
              >
                <div className={cn("absolute inset-x-0 top-0 h-24 opacity-25 blur-3xl", `bg-gradient-to-r ${plan.accentClass}`)} />
                <div className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-400">{plan.badge}</p>
                      <h4 className="mt-2 text-xl font-semibold text-white">{plan.name}</h4>
                    </div>
                    {isCurrent && (
                      <span className="rounded-full border border-pink-400/20 bg-pink-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-pink-200">
                        Active
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-end gap-1">
                    <span className="text-3xl font-semibold text-white">{plan.price}</span>
                    <span className="pb-1 text-sm text-gray-400">{plan.period}</span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-gray-400">{plan.summary}</p>

                  <div className="mt-5 space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    {plan.id === "FREE" ? (
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/plans">
                          {isCurrent ? "Current Free Plan" : "See Plan Details"}
                        </Link>
                      </Button>
                    ) : plan.id === "STUDENT_PRO" ? (
                      <Button
                        className="w-full bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-400 hover:to-violet-500"
                        asChild={!isCurrent}
                        disabled={!razorpayStatus.configured}
                      >
                        {isCurrent ? (
                          <span>Student Pro Active</span>
                        ) : razorpayStatus.configured ? (
                          <Link href="/plans">
                            Continue to checkout
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        ) : (
                          <span>Checkout setup pending</span>
                        )}
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="#contact">
                          Contact for institute plan
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>

                  {plan.note && <p className="mt-3 text-xs text-gray-500">{plan.note}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
