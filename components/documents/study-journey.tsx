"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, FileText, HelpCircle, Map, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type JourneyAction = "notes" | "mcqs" | "viva" | "revision-roadmap";

type JourneyStep = {
  id: JourneyAction;
  title: string;
  completed: boolean;
  href: string;
  actionLabel: string;
};

const STEP_META: Record<JourneyAction, { icon: React.ComponentType<{ className?: string }>; eyebrow: string }> = {
  notes: {
    icon: FileText,
    eyebrow: "Start with understanding",
  },
  mcqs: {
    icon: HelpCircle,
    eyebrow: "Move into recall",
  },
  viva: {
    icon: Sparkles,
    eyebrow: "Practice speaking",
  },
  "revision-roadmap": {
    icon: Map,
    eyebrow: "Finish with a plan",
  },
};

export function StudyJourney({
  steps,
  nextStep,
}: {
  steps: JourneyStep[];
  nextStep?: JourneyStep;
}) {
  const completedCount = steps.filter((step) => step.completed).length;
  const progressValue = steps.length === 0 ? 0 : Math.round((completedCount / steps.length) * 100);

  return (
    <section className="overflow-hidden rounded-[26px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(236,72,153,0.14),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.012)),rgba(9,9,11,0.92)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-gray-400">
              Guided Study Journey
            </div>
            <h2 className="mt-4 text-lg font-semibold text-white sm:text-xl">One document, one clear path to revision</h2>
            <p className="mt-2 max-w-2xl text-sm text-gray-400">
              Follow the sequence that works well for most students: understand the material, test recall, practice oral answers, then lock in a revision plan.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-gray-300">
            <span className="font-semibold text-white">{completedCount}/{steps.length}</span> steps complete
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-gray-500">
            <span>Journey Progress</span>
            <span>{progressValue}%</span>
          </div>
          <Progress value={progressValue} className="h-2.5 bg-white/10" />
        </div>

        {nextStep ? (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Continue with</p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-white">{nextStep.title}</p>
                <p className="mt-1 text-sm text-emerald-100/80">
                  This is the strongest next move for this document right now.
                </p>
              </div>
              <Button asChild className="w-full bg-emerald-500 text-zinc-950 hover:bg-emerald-400 sm:w-auto">
                <Link href={nextStep.href}>
                  {nextStep.actionLabel}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-sky-500/20 bg-sky-500/10 p-4 text-sm text-sky-100/85">
            You have completed the core study loop for this document. Reopen any step to revise again or strengthen weak areas.
          </div>
        )}

        <div className="grid gap-4 xl:grid-cols-2">
          {steps.map((step, index) => {
            const meta = STEP_META[step.id];
            const Icon = meta.icon;

            return (
              <div
                key={step.id}
                className={cn(
                  "rounded-2xl border p-5 transition-colors",
                  step.completed
                    ? "border-emerald-500/20 bg-emerald-500/8"
                    : "border-white/10 bg-white/[0.03]"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "rounded-2xl p-3",
                        step.completed ? "bg-emerald-500/12 text-emerald-300" : "bg-white/5 text-gray-300"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Step {index + 1}</p>
                      <h3 className="mt-1 font-semibold text-white">{step.title}</h3>
                      <p className="mt-1 text-sm text-gray-400">{meta.eyebrow}</p>
                    </div>
                  </div>
                  {step.completed ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-300" />
                  ) : (
                    <Circle className="h-5 w-5 shrink-0 text-gray-500" />
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs",
                      step.completed
                        ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
                        : "border border-white/10 bg-white/5 text-gray-300"
                    )}
                  >
                    {step.completed ? "Completed" : "Up next"}
                  </span>

                  <Link
                    href={step.href}
                    className="text-sm font-medium text-white transition hover:text-pink-300"
                  >
                    {step.actionLabel}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
