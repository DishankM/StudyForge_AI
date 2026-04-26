"use client";

import Link from "next/link";
import { CheckCircle2, Circle, FileText, HelpCircle, Map, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type JourneyAction = "notes" | "mcqs" | "viva" | "revision-roadmap";

type JourneyStep = {
  id: JourneyAction;
  title: string;
  completed: boolean;
  href: string;
  actionLabel: string;
};

const STEP_META: Record<
  JourneyAction,
  { icon: React.ComponentType<{ className?: string }>; eyebrow: string }
> = {
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

  return (
    <section className="rounded-[26px] border border-white/10 bg-zinc-950/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.24)] sm:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white sm:text-xl">Study Flow</h2>
            <p className="mt-1 text-sm text-gray-400">
              Move from understanding to practice in one simple sequence.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-gray-300">
            <span className="font-semibold text-white">{completedCount}/{steps.length}</span> steps complete
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
          {steps.map((step, index) => {
            const meta = STEP_META[step.id];
            const Icon = meta.icon;
            const isNext = !step.completed && nextStep?.id === step.id;
            const statusLabel = step.completed ? "Done" : isNext ? "Next" : "Later";

            return (
              <div
                key={step.id}
                className={cn(
                  "flex min-h-[188px] max-w-full flex-col rounded-2xl border p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_10px_24px_rgba(0,0,0,0.25)] transition-all duration-200 hover:-translate-y-0.5 sm:p-4",
                  step.completed
                    ? "border-emerald-400/25 bg-[linear-gradient(145deg,rgba(16,185,129,0.16)_0%,rgba(16,185,129,0.08)_52%,rgba(4,120,87,0.2)_100%)] hover:border-emerald-300/40 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_16px_30px_rgba(4,120,87,0.25)]"
                    : isNext
                      ? "border-pink-400/30 bg-[linear-gradient(145deg,rgba(236,72,153,0.2)_0%,rgba(244,114,182,0.1)_55%,rgba(131,24,67,0.24)_100%)] hover:border-pink-300/45 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_16px_30px_rgba(190,24,93,0.28)]"
                      : "border-white/12 bg-[linear-gradient(145deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.02)_100%)] hover:border-white/20 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_16px_30px_rgba(0,0,0,0.32)]"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]",
                          step.completed
                            ? "border-emerald-300/25 bg-emerald-500/15 text-emerald-100"
                            : isNext
                              ? "border-pink-300/25 bg-pink-500/15 text-pink-100"
                              : "border-white/15 bg-white/8 text-gray-200"
                        )}
                      >
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] backdrop-blur-sm",
                          step.completed
                            ? "border border-emerald-300/30 bg-emerald-500/20 text-emerald-100"
                            : isNext
                              ? "border border-pink-300/30 bg-pink-500/20 text-pink-100"
                              : "border border-white/15 bg-white/8 text-gray-200"
                        )}
                      >
                        {statusLabel}
                      </span>
                    </div>

                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Step {index + 1}</p>
                    <h3 className="mt-1.5 text-sm font-semibold leading-snug tracking-tight text-white sm:text-[15px]">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-5 text-gray-300/90 sm:text-sm sm:leading-5">{meta.eyebrow}</p>
                  </div>

                  {step.completed ? (
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-300" />
                  ) : (
                    <Circle className="mt-1 h-5 w-5 shrink-0 text-gray-500" />
                  )}
                </div>

                <div className="mt-auto pt-4">
                  <Link
                    href={step.href}
                    className={cn(
                      "flex items-center justify-between rounded-xl border px-3 py-2.5 text-xs font-medium transition sm:text-sm",
                      step.completed
                        ? "border-emerald-300/30 bg-emerald-500/18 text-emerald-100 hover:bg-emerald-500/24"
                        : isNext
                          ? "border-pink-300/30 bg-pink-500/18 text-pink-100 hover:bg-pink-500/24"
                          : "border-white/15 bg-white/[0.07] text-white hover:bg-white/[0.12]"
                    )}
                  >
                    <span>{step.actionLabel}</span>
                    <span className="text-sm leading-none">+</span>
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
