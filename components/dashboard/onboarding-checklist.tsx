"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, Circle, Sparkles, Target, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const DISMISS_KEY = "studyforge-dashboard-onboarding-dismissed";

type ChecklistStep = {
  id: string;
  title: string;
  description: string;
  href: string;
  actionLabel: string;
  completed: boolean;
};

export function OnboardingChecklist({
  userName,
  steps,
}: {
  userName?: string | null;
  steps: ChecklistStep[];
}) {
  const [dismissed, setDismissed] = useState(false);

  const completedSteps = useMemo(
    () => steps.filter((step) => step.completed).length,
    [steps]
  );
  const isComplete = completedSteps === steps.length;
  const progressValue = Math.round((completedSteps / steps.length) * 100);

  useEffect(() => {
    if (!isComplete) {
      window.localStorage.removeItem(DISMISS_KEY);
      setDismissed(false);
      return;
    }

    setDismissed(window.localStorage.getItem(DISMISS_KEY) === "true");
  }, [isComplete]);

  const handleDismiss = () => {
    window.localStorage.setItem(DISMISS_KEY, "true");
    setDismissed(true);
  };

  if (dismissed) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015)),rgba(9,9,11,0.9)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.24)] sm:p-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.16),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),_transparent_32%)]" />

      <div className="relative">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-sm font-medium text-pink-200">
              <Sparkles className="h-4 w-4" />
              First study loop
            </div>
            <h2 className="mt-4 text-xl font-semibold text-white sm:text-2xl">
              {isComplete
                ? `Nice work${userName ? `, ${userName}` : ""}. Your first StudyForge workflow is complete.`
                : "Finish your first study workflow"}
            </h2>
            <p className="mt-2 text-sm leading-7 text-gray-300 sm:text-base">
              {isComplete
                ? "You have uploaded a file, generated study material, and unlocked practice. You can hide this checklist now or keep using it as a quick status view."
                : "Follow these three steps to get from raw material to practice-ready revision content."}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 lg:min-w-[260px]">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-gray-300">
                <Target className="h-4 w-4 text-pink-300" />
                <span className="text-sm font-medium">Progress</span>
              </div>
              <span className="text-sm text-white">
                {completedSteps}/{steps.length}
              </span>
            </div>
            <Progress value={progressValue} className="mt-3 h-2.5" />
            <p className="mt-3 text-xs leading-6 text-gray-400">
              {isComplete
                ? "Everything is set for future uploads and practice sessions."
                : "This checklist stays visible until your first loop is complete."}
            </p>
            {isComplete && (
              <Button
                type="button"
                variant="outline"
                onClick={handleDismiss}
                className="mt-4 min-h-11 w-full"
              >
                <X className="mr-2 h-4 w-4" />
                Hide checklist
              </Button>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="rounded-[24px] border border-white/10 bg-black/20 p-5 backdrop-blur-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {step.completed ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  ) : (
                    <Circle className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
                  )}
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-gray-500">
                      Step {index + 1}
                    </p>
                    <h3 className="mt-2 text-base font-semibold text-white">{step.title}</h3>
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    step.completed
                      ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
                      : "border border-white/10 bg-white/5 text-gray-300"
                  }`}
                >
                  {step.completed ? "Done" : "Next"}
                </span>
              </div>

              <p className="mt-4 text-sm leading-7 text-gray-400">{step.description}</p>

              <div className="mt-5">
                <Button
                  asChild
                  variant={step.completed ? "outline" : "default"}
                  className="min-h-11 w-full justify-between"
                >
                  <Link href={step.href}>
                    {step.completed ? "Open again" : step.actionLabel}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
