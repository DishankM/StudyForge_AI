"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  CalendarRange,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  ChevronUp,
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

type ViewerProgressState = {
  tasks: Record<string, boolean>;
  checklist: Record<string, boolean>;
  expanded: Record<string, boolean>;
};

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

function progressWidth(completed: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((completed / total) * 100);
}

function phaseTaskRange(totalDays: number, phaseIndex: number, phaseCount: number) {
  return {
    start: Math.floor((totalDays * phaseIndex) / phaseCount),
    end: Math.floor((totalDays * (phaseIndex + 1)) / phaseCount),
  };
}

function ToggleButton({
  expanded,
  onClick,
}: {
  expanded: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-300 transition hover:bg-white/10"
    >
      {expanded ? (
        <>
          Collapse
          <ChevronUp className="h-3.5 w-3.5" />
        </>
      ) : (
        <>
          Expand
          <ChevronDown className="h-3.5 w-3.5" />
        </>
      )}
    </button>
  );
}

export function RoadmapViewer({
  roadmapId,
  roadmap,
  subjectName,
  examDate,
  daysUntilExam,
  studyHoursPerDay,
  preparationLevelLabel,
  sourceLabel,
}: {
  roadmapId: string;
  roadmap: RevisionRoadmap;
  subjectName: string;
  examDate: Date;
  daysUntilExam: number;
  studyHoursPerDay: number;
  preparationLevelLabel: string;
  sourceLabel: string | null;
}) {
  const storageKey = `studyforge-roadmap-progress:${roadmapId}`;
  const [progressState, setProgressState] = useState<ViewerProgressState>({
    tasks: {},
    checklist: {},
    expanded: {},
  });

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as ViewerProgressState;
      setProgressState({
        tasks: parsed.tasks ?? {},
        checklist: parsed.checklist ?? {},
        expanded: parsed.expanded ?? {},
      });
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(progressState));
  }, [progressState, storageKey]);

  const toggleTask = (taskId: string) => {
    setProgressState((current) => ({
      ...current,
      tasks: {
        ...current.tasks,
        [taskId]: !current.tasks[taskId],
      },
    }));
  };

  const toggleChecklistItem = (itemId: string) => {
    setProgressState((current) => ({
      ...current,
      checklist: {
        ...current.checklist,
        [itemId]: !current.checklist[itemId],
      },
    }));
  };

  const toggleExpanded = (sectionId: string) => {
    setProgressState((current) => ({
      ...current,
      expanded: {
        ...current.expanded,
        [sectionId]: current.expanded[sectionId] === false ? true : false,
      },
    }));
  };

  const isExpanded = (sectionId: string) => progressState.expanded[sectionId] !== false;

  const totalDailyTasks = roadmap.dailyPlan.reduce((sum, day) => sum + day.taskList.length, 0);
  const completedDailyTasks = roadmap.dailyPlan.reduce(
    (sum, day, dayIndex) =>
      sum +
      day.taskList.filter((_, taskIndex) => progressState.tasks[`day:${dayIndex}:task:${taskIndex}`]).length,
    0
  );
  const completedChecklist = roadmap.finalWeekChecklist.filter(
    (_, index) => progressState.checklist[`checklist:${index}`]
  ).length;

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

          <div className="grid w-full shrink-0 gap-3 sm:grid-cols-2 lg:w-[min(100%,420px)] lg:grid-cols-2">
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
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wider text-gray-500">Daily task progress</p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {completedDailyTasks}/{totalDailyTasks}
              </p>
              <div className="mt-3 h-2 w-full rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                  style={{ width: `${progressWidth(completedDailyTasks, totalDailyTasks)}%` }}
                />
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wider text-gray-500">Final week checklist</p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {completedChecklist}/{roadmap.finalWeekChecklist.length}
              </p>
              <div className="mt-3 h-2 w-full rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-violet-500"
                  style={{ width: `${progressWidth(completedChecklist, roadmap.finalWeekChecklist.length)}%` }}
                />
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
            roadmap.unitPlans.map((unit, index) => {
              const sectionId = `unit:${index}`;
              const expanded = isExpanded(sectionId);

              return (
                <article
                  key={unit.unitName}
                  className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5 transition hover:border-white/15"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{unit.unitName}</h3>
                      <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-400">
                        <span>Weightage: {unit.expectedWeightage}</span>
                        <span>~{unit.recommendedHours}h suggested</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-0.5 text-xs font-medium",
                          importanceStyles(unit.importance)
                        )}
                      >
                        {unit.importance}
                      </span>
                      <ToggleButton expanded={expanded} onClick={() => toggleExpanded(sectionId)} />
                    </div>
                  </div>

                  {expanded && (
                    <>
                      <p className="mt-3 text-sm leading-relaxed text-gray-300">{unit.whyItMatters}</p>
                      {unit.keyTopics.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Key topics</p>
                          <ul className="mt-2 flex flex-wrap gap-2">
                            {unit.keyTopics.map((topic) => (
                              <li
                                key={topic}
                                className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-200"
                              >
                                {topic}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </article>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="topics" className="space-y-4">
          {roadmap.priorityTopics.length === 0 ? (
            <EmptyTab message="No priority topics listed. Try adding focus areas when you generate again." />
          ) : (
            roadmap.priorityTopics.map((topic, index) => {
              const sectionId = `topic:${index}`;
              const expanded = isExpanded(sectionId);

              return (
                <article
                  key={`${topic.topic}-${topic.unit}`}
                  className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{topic.topic}</h3>
                      <p className="mt-1 text-sm text-gray-500">{topic.unit}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-0.5 text-xs font-medium",
                          importanceStyles(topic.importance)
                        )}
                      >
                        {topic.importance}
                      </span>
                      <ToggleButton expanded={expanded} onClick={() => toggleExpanded(sectionId)} />
                    </div>
                  </div>

                  {expanded && (
                    <>
                      <p className="mt-3 text-sm text-gray-300">{topic.reason}</p>
                      <div className="mt-4 rounded-xl border border-pink-500/20 bg-pink-500/5 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-pink-200/90">
                          How to revise
                        </p>
                        <p className="mt-1 text-sm text-gray-200">{topic.revisionApproach}</p>
                      </div>
                    </>
                  )}
                </article>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="phases" className="space-y-4">
          {roadmap.studyPhases.length === 0 ? (
            <EmptyTab message="No study phases in this roadmap." />
          ) : (
            <ol className="relative space-y-4 border-l border-white/10 pl-6">
              {roadmap.studyPhases.map((phase, phaseIndex) => {
                const sectionId = `phase:${phaseIndex}`;
                const expanded = isExpanded(sectionId);
                const range = phaseTaskRange(
                  roadmap.dailyPlan.length,
                  phaseIndex,
                  roadmap.studyPhases.length
                );
                const daysForPhase = roadmap.dailyPlan.slice(range.start, range.end);
                const totalTasks = daysForPhase.reduce((sum, day) => sum + day.taskList.length, 0);
                const completedTasks = daysForPhase.reduce(
                  (sum, day, offsetIndex) =>
                    sum +
                    day.taskList.filter(
                      (_, taskIndex) =>
                        progressState.tasks[`day:${range.start + offsetIndex}:task:${taskIndex}`]
                    ).length,
                  0
                );

                return (
                  <li key={phase.phaseTitle} className="relative">
                    <span className="absolute -left-[29px] top-1 flex h-7 w-7 items-center justify-center rounded-full border border-pink-500/40 bg-zinc-900 text-xs font-bold text-pink-300">
                      {phaseIndex + 1}
                    </span>
                    <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline gap-2">
                            <h3 className="text-lg font-semibold text-white">{phase.phaseTitle}</h3>
                            <span className="text-sm text-gray-500">{phase.dateRange}</span>
                          </div>
                          <div className="mt-3">
                            <div className="mb-2 flex items-center justify-between text-xs text-gray-400">
                              <span>Phase progress</span>
                              <span>
                                {completedTasks}/{totalTasks || 0} tasks
                              </span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-white/10">
                              <div
                                className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                                style={{ width: `${progressWidth(completedTasks, totalTasks)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <ToggleButton expanded={expanded} onClick={() => toggleExpanded(sectionId)} />
                      </div>

                      {expanded && (
                        <>
                          <p className="mt-4 text-sm text-gray-300">{phase.goal}</p>
                          <ul className="mt-3 space-y-1 text-sm text-gray-400">
                            {phase.studyFocus.map((focus) => (
                              <li key={focus} className="flex gap-2">
                                <span className="text-pink-400">•</span>
                                {focus}
                              </li>
                            ))}
                          </ul>
                          <p className="mt-4 text-sm font-medium text-white/90">
                            Output: <span className="font-normal text-gray-300">{phase.outputTarget}</span>
                          </p>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </TabsContent>

        <TabsContent value="daily" className="space-y-4">
          {roadmap.dailyPlan.length === 0 ? (
            <EmptyTab message="No daily plan items." />
          ) : (
            roadmap.dailyPlan.map((day, dayIndex) => {
              const sectionId = `day:${dayIndex}`;
              const expanded = isExpanded(sectionId);
              const totalTasks = day.taskList.length;
              const completedTasks = day.taskList.filter(
                (_, taskIndex) => progressState.tasks[`day:${dayIndex}:task:${taskIndex}`]
              ).length;

              return (
                <article
                  key={`${day.dayLabel}-${day.dateLabel}`}
                  className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-white">{day.dayLabel}</h3>
                      <p className="text-sm text-gray-500">{day.dateLabel}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
                        {day.hours}h
                      </span>
                      <ToggleButton expanded={expanded} onClick={() => toggleExpanded(sectionId)} />
                    </div>
                  </div>

                  <p className="mt-3 text-sm font-medium text-pink-200/90">{day.focus}</p>
                  <div className="mt-3">
                    <div className="mb-2 flex items-center justify-between text-xs text-gray-400">
                      <span>Task completion</span>
                      <span>
                        {completedTasks}/{totalTasks}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/10">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-violet-500"
                        style={{ width: `${progressWidth(completedTasks, totalTasks)}%` }}
                      />
                    </div>
                  </div>

                  {expanded && (
                    <div className="mt-4 space-y-2">
                      {day.taskList.map((task, taskIndex) => {
                        const taskId = `day:${dayIndex}:task:${taskIndex}`;
                        const completed = Boolean(progressState.tasks[taskId]);

                        return (
                          <button
                            key={taskId}
                            type="button"
                            onClick={() => toggleTask(taskId)}
                            className={cn(
                              "flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition",
                              completed
                                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-50"
                                : "border-white/10 bg-black/20 text-gray-200 hover:bg-white/[0.04]"
                            )}
                          >
                            {completed ? (
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                            ) : (
                              <span className="mt-1 h-4 w-4 shrink-0 rounded-full border border-white/20" />
                            )}
                            <span
                              className={cn(
                                "text-sm leading-relaxed",
                                completed && "line-through decoration-emerald-300/60"
                              )}
                            >
                              {task}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </article>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="checklist">
          {roadmap.finalWeekChecklist.length === 0 ? (
            <EmptyTab message="No final-week checklist. Use the daily plan for your last stretch." />
          ) : (
            <div className="space-y-4 rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
              {roadmap.finalWeekChecklist.map((item, index) => {
                const itemId = `checklist:${index}`;
                const completed = Boolean(progressState.checklist[itemId]);

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleChecklistItem(itemId)}
                    className={cn(
                      "flex w-full gap-3 rounded-xl border px-3 py-3 text-left text-sm transition",
                      completed
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-50"
                        : "border-white/5 bg-black/20 text-gray-200 hover:bg-white/[0.04]"
                    )}
                  >
                    <CheckSquare
                      className={cn(
                        "mt-0.5 h-4 w-4 shrink-0",
                        completed ? "text-emerald-300" : "text-gray-500"
                      )}
                    />
                    <span
                      className={cn(
                        "leading-relaxed",
                        completed && "line-through decoration-emerald-300/60"
                      )}
                    >
                      {item}
                    </span>
                  </button>
                );
              })}
            </div>
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
