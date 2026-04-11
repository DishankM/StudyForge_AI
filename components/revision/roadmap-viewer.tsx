"use client";

import {
  BookOpen,
  CalendarRange,
  CheckSquare,
  Flag,
  Layers,
  ListTodo,
  Sparkles,
  Target,
} from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { RevisionRoadmap } from "@/lib/types/revision-roadmap";
import { cn } from "@/lib/utils";

function importanceStyles(level: string) {
  switch (level) {
    case "High":
      return "border-red-500/35 bg-red-500/10 text-red-200";
    case "Medium":
      return "border-amber-500/35 bg-amber-500/10 text-amber-100";
    case "Low":
      return "border-emerald-500/35 bg-emerald-500/10 text-emerald-100";
    default:
      return "border-white/15 bg-white/5 text-gray-200";
  }
}

export function RoadmapViewer({
  roadmap,
  subjectName,
  examDate,
  daysUntilExam,
  studyHoursPerDay,
  preparationLevelLabel,
  sourceLabel,
}: {
  roadmap: RevisionRoadmap;
  subjectName: string;
  examDate: Date;
  daysUntilExam: number;
  studyHoursPerDay: number;
  preparationLevelLabel: string;
  sourceLabel: string | null;
}) {
  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(145deg,rgba(236,72,153,0.12),transparent_42%),linear-gradient(225deg,rgba(139,92,246,0.12),transparent_45%),rgba(24,24,27,0.95)] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.35)] sm:p-8">
        <div className="absolute -right-20 -top-16 h-48 w-48 rounded-full bg-pink-500/20 blur-3xl" />
        <div className="absolute -bottom-24 left-10 h-52 w-52 rounded-full bg-violet-500/15 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
              <Sparkles className="h-3.5 w-3.5 text-pink-300" />
              Exam roadmap
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
              {roadmap.roadmapTitle}
            </h1>
            <p className="text-base leading-relaxed text-gray-300">{roadmap.overview}</p>
          </div>

          <div className="grid w-full shrink-0 gap-3 sm:grid-cols-2 lg:w-[min(100%,380px)] lg:grid-cols-1">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wider text-gray-500">Subject</p>
              <p className="mt-1 font-semibold text-white">{subjectName}</p>
              <p className="mt-3 text-xs uppercase tracking-wider text-gray-500">Exam</p>
              <p className="mt-1 text-sm text-gray-200">{format(examDate, "PPP")}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wider text-gray-500">Timeline</p>
              <p className="mt-1 text-2xl font-semibold text-white">{daysUntilExam}</p>
              <p className="text-sm text-gray-400">days to exam (at generation)</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-400">
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
                  {studyHoursPerDay}h / day
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
                  {preparationLevelLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {sourceLabel && (
          <p className="relative mt-6 text-sm text-gray-500">
            <span className="text-gray-400">Source:</span> {sourceLabel}
          </p>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-5">
          <div className="flex items-center gap-2 text-pink-300">
            <Target className="h-5 w-5" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Readiness</h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-gray-300">{roadmap.examReadinessSummary}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-5">
          <div className="flex items-center gap-2 text-violet-300">
            <Flag className="h-5 w-5" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Strategy</h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-gray-300">{roadmap.recommendedStrategy}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-5">
          <div className="flex items-center gap-2 text-cyan-300">
            <Layers className="h-5 w-5" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Coverage</h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-gray-300">{roadmap.unitCoverageSummary}</p>
        </div>
      </div>

      {roadmap.likelyHighYieldAreas.length > 0 && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
          <h2 className="text-lg font-semibold text-amber-100">Likely high-yield areas</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {roadmap.likelyHighYieldAreas.map((area) => (
              <li
                key={area}
                className="flex items-start gap-2 rounded-xl border border-amber-500/15 bg-black/20 px-3 py-2 text-sm text-amber-50/95"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                {area}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Tabs defaultValue="units" className="w-full">
        <TabsList className="flex h-auto min-h-10 w-full flex-wrap justify-start gap-1 bg-zinc-900/90 p-1">
          <TabsTrigger value="units" className="gap-1.5">
            <BookOpen className="h-3.5 w-3.5" />
            Units
          </TabsTrigger>
          <TabsTrigger value="topics" className="gap-1.5">
            <Target className="h-3.5 w-3.5" />
            Priority topics
          </TabsTrigger>
          <TabsTrigger value="phases" className="gap-1.5">
            <CalendarRange className="h-3.5 w-3.5" />
            Phases
          </TabsTrigger>
          <TabsTrigger value="daily" className="gap-1.5">
            <ListTodo className="h-3.5 w-3.5" />
            Daily plan
          </TabsTrigger>
          <TabsTrigger value="checklist" className="gap-1.5">
            <CheckSquare className="h-3.5 w-3.5" />
            Final week
          </TabsTrigger>
        </TabsList>

        <TabsContent value="units" className="space-y-4">
          {roadmap.unitPlans.length === 0 ? (
            <EmptyTab message="No unit breakdown was returned. Regenerate with a clearer syllabus or document." />
          ) : (
            roadmap.unitPlans.map((unit) => (
              <article
                key={unit.unitName}
                className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5 transition hover:border-white/15"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-white">{unit.unitName}</h3>
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-xs font-medium",
                      importanceStyles(unit.importance)
                    )}
                  >
                    {unit.importance}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-400">
                  <span>Weightage: {unit.expectedWeightage}</span>
                  <span>~{unit.recommendedHours}h suggested</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gray-300">{unit.whyItMatters}</p>
                {unit.keyTopics.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Key topics</p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {unit.keyTopics.map((t) => (
                        <li
                          key={t}
                          className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-200"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            ))
          )}
        </TabsContent>

        <TabsContent value="topics" className="space-y-4">
          {roadmap.priorityTopics.length === 0 ? (
            <EmptyTab message="No priority topics listed. Try adding focus areas when you generate again." />
          ) : (
            roadmap.priorityTopics.map((topic) => (
              <article
                key={`${topic.topic}-${topic.unit}`}
                className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{topic.topic}</h3>
                    <p className="mt-1 text-sm text-gray-500">{topic.unit}</p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-xs font-medium",
                      importanceStyles(topic.importance)
                    )}
                  >
                    {topic.importance}
                  </span>
                </div>
                <p className="mt-3 text-sm text-gray-300">{topic.reason}</p>
                <div className="mt-4 rounded-xl border border-pink-500/20 bg-pink-500/5 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-pink-200/90">
                    How to revise
                  </p>
                  <p className="mt-1 text-sm text-gray-200">{topic.revisionApproach}</p>
                </div>
              </article>
            ))
          )}
        </TabsContent>

        <TabsContent value="phases" className="space-y-4">
          {roadmap.studyPhases.length === 0 ? (
            <EmptyTab message="No study phases in this roadmap." />
          ) : (
            <ol className="relative space-y-4 border-l border-white/10 pl-6">
              {roadmap.studyPhases.map((phase, i) => (
                <li key={phase.phaseTitle} className="relative">
                  <span className="absolute -left-[29px] top-1 flex h-7 w-7 items-center justify-center rounded-full border border-pink-500/40 bg-zinc-900 text-xs font-bold text-pink-300">
                    {i + 1}
                  </span>
                  <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-lg font-semibold text-white">{phase.phaseTitle}</h3>
                      <span className="text-sm text-gray-500">{phase.dateRange}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-300">{phase.goal}</p>
                    <ul className="mt-3 space-y-1 text-sm text-gray-400">
                      {phase.studyFocus.map((f) => (
                        <li key={f} className="flex gap-2">
                          <span className="text-pink-400">•</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-sm font-medium text-white/90">
                      Output: <span className="font-normal text-gray-300">{phase.outputTarget}</span>
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </TabsContent>

        <TabsContent value="daily" className="space-y-4">
          {roadmap.dailyPlan.length === 0 ? (
            <EmptyTab message="No daily plan items." />
          ) : (
            roadmap.dailyPlan.map((day) => (
              <article
                key={`${day.dayLabel}-${day.dateLabel}`}
                className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-white">{day.dayLabel}</h3>
                    <p className="text-sm text-gray-500">{day.dateLabel}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
                    {day.hours}h
                  </span>
                </div>
                <p className="mt-3 text-sm font-medium text-pink-200/90">{day.focus}</p>
                <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-gray-300">
                  {day.taskList.map((task) => (
                    <li key={task} className="leading-relaxed">
                      {task}
                    </li>
                  ))}
                </ol>
              </article>
            ))
          )}
        </TabsContent>

        <TabsContent value="checklist">
          {roadmap.finalWeekChecklist.length === 0 ? (
            <EmptyTab message="No final-week checklist. Use the daily plan for your last stretch." />
          ) : (
            <ul className="space-y-2 rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
              {roadmap.finalWeekChecklist.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-xl border border-white/5 bg-black/20 px-3 py-2.5 text-sm text-gray-200"
                >
                  <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400/90" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyTab({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-zinc-900/40 p-8 text-center text-sm text-gray-400">
      {message}
    </div>
  );
}
