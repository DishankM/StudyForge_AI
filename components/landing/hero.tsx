"use client";

import Link from "next/link";
import { ArrowRight, FileCheck2, LayoutDashboard, ListChecks, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

const quickPoints = [
  "Upload PDFs, notes, and syllabus files",
  "Generate notes, MCQs, viva questions, and exam papers",
  "Revise from one clear dashboard instead of scattered files",
];

const outputs = [
  { label: "Short Notes", icon: Sparkles },
  { label: "MCQ Practice", icon: ListChecks },
  { label: "Exam Papers", icon: FileCheck2 },
];

export function Hero() {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";
  const primaryCtaHref = isLoggedIn ? "/dashboard" : "/auth/signup";
  const primaryCtaLabel = isLoggedIn ? "Go to Dashboard" : "Start Free Trial";

  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(236,72,153,0.14),transparent_30%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.14),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-400/40 to-transparent" />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-center lg:px-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-pink-200">
            <Sparkles className="h-3.5 w-3.5" />
            Exam prep workspace
          </div>

          <h1 className="mt-6 max-w-3xl font-heading text-4xl font-bold leading-[1.05] text-text-primary sm:text-5xl lg:text-6xl">
            Turn study material into revision-ready outputs faster.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
            StudyForge helps students convert raw class material into clear notes, practice questions, and university-style exam papers without dragging through long files every time.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="xl" className="sm:w-auto" asChild>
              <Link href={primaryCtaHref} className="gap-2">
                {primaryCtaLabel}
                {isLoggedIn && <LayoutDashboard className="h-4.5 w-4.5" />}
              </Link>
            </Button>
            {isLoggedIn ? (
              <Button variant="outline" size="xl" className="gap-2 sm:w-auto" asChild>
                <Link href="/dashboard/settings?tab=billing">
                  Manage Subscription
                  <ArrowRight className="h-4.5 w-4.5" />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="xl" className="gap-2 sm:w-auto" asChild>
                <Link href="#demo">
                  Preview Outputs
                  <ArrowRight className="h-4.5 w-4.5" />
                </Link>
              </Button>
            )}
          </div>

          <ul className="mt-8 grid gap-3 text-sm text-text-secondary sm:grid-cols-3 sm:text-[15px]">
            {quickPoints.map((point) => (
              <li key={point} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-pink-500/10 via-transparent to-indigo-500/10 blur-2xl" />
          <div className="relative rounded-[2rem] border border-white/10 bg-zinc-950/80 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-text-muted">StudyForge Flow</p>
                <h2 className="mt-2 text-xl font-semibold text-text-primary">One upload, multiple revision formats</h2>
              </div>
              <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                Fast prep
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Input</p>
              <p className="mt-2 text-sm text-text-secondary">Lecture PDF, chapter notes, or syllabus module</p>
            </div>

            <div className="my-4 flex items-center justify-center">
              <div className="rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-2 text-xs font-medium text-pink-200">
                AI extracts and structures the content
              </div>
            </div>

            <div className="grid gap-3">
              {outputs.map((output) => (
                <div
                  key={output.label}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-pink to-primary-purple">
                    <output.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{output.label}</p>
                    <p className="text-xs text-text-muted">Ready to revise, practice, and download</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
