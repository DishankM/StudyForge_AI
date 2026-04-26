import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { RoadmapDeleteButton } from "@/components/revision/roadmap-delete-button";
import {
  ArrowRight,
  BookOpenText,
  Calendar,
  Clock3,
  Map,
  Route,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import type { PreparationLevel } from "@/lib/types/revision-roadmap";

const PREP_LABELS: Record<PreparationLevel, string> = {
  "just-starting": "Just starting",
  "somewhat-prepared": "Somewhat prepared",
  "revision-mode": "Revision mode",
};

export default async function RevisionRoadmapsPage() {
  const session = await auth();

  const roadmaps = await prisma.revisionRoadmap.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      document: { select: { fileName: true } },
    },
  });

  const latestRoadmap = roadmaps[0];
  const closestExam = [...roadmaps].sort((a, b) => a.daysUntilExam - b.daysUntilExam)[0];
  const avgHours = roadmaps.length > 0
    ? Math.round(roadmaps.reduce((sum, row) => sum + row.studyHoursPerDay, 0) / roadmaps.length)
    : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.14),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015)),rgba(9,9,11,0.92)] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.28)] sm:rounded-[30px] sm:p-8">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),transparent_48%)]" />
        <div className="relative grid gap-5 sm:gap-6 lg:grid-cols-[1.35fr_0.85fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1.5 text-xs text-indigo-100 sm:px-4 sm:text-sm">
              <Route className="h-4 w-4" />
              Exam Roadmaps
            </div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:mt-5 sm:text-4xl">
              Turn your timeline into a structured revision path
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-300 sm:leading-7 sm:text-base">
              Plan around your exam date, available study hours, and actual material. Roadmaps help you move from vague revision goals to a clear sequence of daily work.
            </p>
            <div className="mt-5 sm:mt-6">
              <Button asChild className="min-h-11 w-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 shadow-[0_12px_30px_rgba(99,102,241,0.24)] sm:w-auto">
                <Link href="/dashboard/revision/new">
                  <Map className="mr-2 h-4 w-4" />
                  New roadmap
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3.5 backdrop-blur-sm sm:p-4">
              <div className="flex items-center gap-2 text-indigo-100">
                <Clock3 className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.22em] text-indigo-100/80">Latest Roadmap</span>
              </div>
              <p className="mt-3 line-clamp-2 text-sm font-semibold text-white sm:text-base">
                {latestRoadmap ? latestRoadmap.title : "Your next roadmap will appear here"}
              </p>
              <p className="mt-1 text-sm text-gray-400">
                {latestRoadmap
                  ? `${latestRoadmap.studyHoursPerDay}h/day planned`
                  : "Create a roadmap to organize your next revision cycle."}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3.5 backdrop-blur-sm sm:p-4">
              <div className="flex items-center gap-2 text-pink-100">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.22em] text-pink-100/80">Nearest Exam</span>
              </div>
              <p className="mt-3 text-sm font-semibold text-white sm:text-base">
                {closestExam ? `${closestExam.daysUntilExam} days left` : "No exam timelines yet"}
              </p>
              <p className="mt-1 text-sm text-gray-400">
                {closestExam ? closestExam.subjectName : "Add an exam date to make planning more useful."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
        <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01)),rgba(24,24,27,0.92)] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-indigo-500/10 p-2.5 sm:p-3">
              <Map className="h-5 w-5 text-indigo-300" />
            </div>
            <p className="text-sm text-gray-400">Total Roadmaps</p>
          </div>
          <p className="mt-3 text-2xl font-bold text-white sm:mt-4 sm:text-3xl">{roadmaps.length}</p>
        </div>
        <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01)),rgba(24,24,27,0.92)] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-fuchsia-500/10 p-2.5 sm:p-3">
              <BookOpenText className="h-5 w-5 text-fuchsia-300" />
            </div>
            <p className="text-sm text-gray-400">Avg Hours/Day</p>
          </div>
          <p className="mt-3 text-2xl font-bold text-white sm:mt-4 sm:text-3xl">{avgHours}</p>
        </div>
        <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01)),rgba(24,24,27,0.92)] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:p-6 sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-pink-500/10 p-2.5 sm:p-3">
              <Calendar className="h-5 w-5 text-pink-300" />
            </div>
            <p className="text-sm text-gray-400">Soonest Exam</p>
          </div>
          <p className="mt-3 text-2xl font-bold text-white sm:mt-4 sm:text-3xl">
            {closestExam ? closestExam.daysUntilExam : 0} days
          </p>
        </div>
      </div>

      {roadmaps.length === 0 ? (
        <EmptyState
          icon={Map}
          title="No roadmaps yet"
          description="Generate a personalized exam roadmap from your documents or syllabus so you get unit priorities, phased goals, and a day-by-day plan."
          examples={["A syllabus with an exam date", "A difficult subject with limited prep time", "A final revision plan for the next 2 weeks"]}
          helperText="Roadmaps become much more useful when you know your exam date and available study hours. Add one source document if you want the plan to reflect your actual material."
          actionLabel="Create your first roadmap"
          actionHref="/dashboard/revision/new"
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
          {roadmaps.map((row) => {
            const prep = PREP_LABELS[row.preparationLevel as PreparationLevel] ?? row.preparationLevel;
            return (
              <div
                key={row.id}
                className="group overflow-hidden rounded-[22px] border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.012)),rgba(24,24,27,0.92)] p-0 shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/30 sm:rounded-[26px]"
              >
                <div className="border-b border-white/10 p-5 sm:p-6">
                  <div className="mb-4 flex items-start gap-2.5 sm:gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-lg shadow-indigo-950/40 sm:h-11 sm:w-11">
                      <Map className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-indigo-400/20 bg-indigo-400/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-indigo-100">
                          {prep}
                        </span>
                      </div>
                      <h2 className="mt-3 line-clamp-2 text-base font-semibold text-white">{row.title}</h2>
                      <p className="mt-2 line-clamp-2 text-sm text-gray-400">{row.subjectName}</p>
                    </div>
                  </div>

                  <p className="text-sm leading-6 text-gray-300 sm:leading-7">
                    Follow a phased study plan with daily tasks, topic priorities, and a final revision checklist built around your exam date.
                  </p>
                </div>

                <div className="space-y-4 p-5 sm:space-y-5 sm:p-6">
                  <div className="grid grid-cols-2 gap-2.5 text-sm sm:gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Exam Date</p>
                      <p className="mt-2 font-medium text-white">{format(row.examDate, "MMM d, yyyy")}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Timeline</p>
                      <p className="mt-2 font-medium text-white">{row.daysUntilExam} days</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 sm:p-4">
                    <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-gray-500">Study context</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">Study hours</p>
                        <p className="mt-1 text-sm font-medium text-gray-200">{row.studyHoursPerDay}h/day</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Source</p>
                        <p className="mt-1 line-clamp-2 text-sm font-medium text-gray-200">
                          {row.document?.fileName ?? "Syllabus only"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 pt-1 md:grid-cols-2">
                    <Link href={`/dashboard/revision/${row.id}`} className="block">
                      <Button
                        variant="outline"
                        className="h-11 w-full border-white/10 bg-white/[0.02] text-white shadow-[0_10px_30px_rgba(0,0,0,0.12)] hover:border-indigo-400/30 hover:bg-indigo-400/10 sm:h-12"
                        size="sm"
                      >
                        Open roadmap
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <RoadmapDeleteButton
                      roadmapId={row.id}
                      redirectTo=""
                      variant="ghost"
                      size="sm"
                      className="min-h-11 w-full justify-center text-red-400 hover:text-red-300 sm:min-h-12"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
