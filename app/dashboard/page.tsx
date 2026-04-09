import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardStats } from "@/components/dashboard/stats";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { Sparkles, TrendingUp } from "lucide-react";

function getWeekRanges() {
  const now = new Date();

  return Array.from({ length: 4 }, (_, index) => {
    const start = new Date(now);
    start.setDate(start.getDate() - (3 - index) * 7);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    return { start, end };
  });
}

function countItemsInWeeks(
  dates: Array<{ createdAt?: Date; uploadedAt?: Date }>,
  weekRanges: Array<{ start: Date; end: Date }>
) {
  const totals = Array.from({ length: weekRanges.length }, () => 0);

  for (const item of dates) {
    const value = item.createdAt ?? item.uploadedAt;
    if (!value) continue;

    const timestamp = value.getTime();
    const index = weekRanges.findIndex(
      (range) => timestamp >= range.start.getTime() && timestamp < range.end.getTime()
    );

    if (index >= 0) {
      totals[index] += 1;
    }
  }

  return totals;
}

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;
  const weekRanges = getWeekRanges();
  const firstWeekStart = weekRanges[0].start;

  const [
    documentsCount,
    notesCount,
    mcqCount,
    examPapersCount,
    recentDocuments,
    documentDates,
    noteDates,
    mcqDates,
    examDates,
  ] = await prisma.$transaction([
    prisma.document.count({ where: { userId } }),
    prisma.note.count({ where: { userId } }),
    prisma.mcqSet.count({ where: { userId } }),
    prisma.examPaper.count({ where: { userId } }),
    prisma.document.findMany({
      where: { userId },
      orderBy: { uploadedAt: "desc" },
      take: 5,
    }),
    prisma.document.findMany({
      where: { userId, uploadedAt: { gte: firstWeekStart } },
      select: { uploadedAt: true },
    }),
    prisma.note.findMany({
      where: { userId, createdAt: { gte: firstWeekStart } },
      select: { createdAt: true },
    }),
    prisma.mcqSet.findMany({
      where: { userId, createdAt: { gte: firstWeekStart } },
      select: { createdAt: true },
    }),
    prisma.examPaper.findMany({
      where: { userId, createdAt: { gte: firstWeekStart } },
      select: { createdAt: true },
    }),
  ]);

  const weeklyDocumentTotals = countItemsInWeeks(documentDates, weekRanges);
  const weeklyNoteTotals = countItemsInWeeks(noteDates, weekRanges);
  const weeklyMcqTotals = countItemsInWeeks(mcqDates, weekRanges);
  const weeklyExamTotals = countItemsInWeeks(examDates, weekRanges);

  const weeklyTotals = weekRanges.map((_, index) => {
    const documents = weeklyDocumentTotals[index];
    const notes = weeklyNoteTotals[index];
    const mcqs = weeklyMcqTotals[index];
    const exams = weeklyExamTotals[index];

    return documents + notes + mcqs + exams;
  });

  const maxWeekly = Math.max(1, ...weeklyTotals);
  const usageData = weekRanges.map((range, index) => {
    const total = weeklyTotals[index];

    return {
      label: range.start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      total,
      value: Math.round((total / maxWeekly) * 100),
    };
  });

  const totalStudyAssets = documentsCount + notesCount + mcqCount + examPapersCount;
  const mostActiveLabel = usageData.reduce((best, current) =>
    current.total > best.total ? current : best
  ).label;

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950/80 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-6 lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.18),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.16),_transparent_32%)]" />
        <div className="absolute -right-16 top-0 h-44 w-44 rounded-full bg-pink-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-20 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-sm font-medium text-pink-200">
              <Sparkles className="h-4 w-4" />
              StudyForge workspace
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Welcome back, {session!.user.name || "Student"}.
            </h1>
            <p className="mt-3 max-w-2xl text-base text-gray-300">
              Keep your preparation moving with one place for documents, notes, MCQs, and exam-ready material.
            </p>
          </div>

          <div className="grid gap-3 lg:grid-cols-2 xl:min-w-[420px]">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-gray-400">Study Assets</p>
              <p className="mt-2 text-3xl font-semibold text-white">{totalStudyAssets}</p>
              <p className="mt-1 text-sm text-gray-400">Across uploads, notes, MCQs, and exam papers</p>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-emerald-200">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.24em]">Momentum</span>
              </div>
              <p className="mt-2 text-3xl font-semibold text-white">{usageData.reduce((sum, point) => sum + point.total, 0)}</p>
              <p className="mt-1 text-sm text-emerald-100/80">Items created in the last 4 weeks, strongest week starting {mostActiveLabel}</p>
            </div>
          </div>
        </div>
      </div>

      <DashboardStats
        documents={documentsCount}
        notes={notesCount}
        mcqs={mcqCount}
        examPapers={examPapersCount}
      />

      <QuickActions />

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity documents={recentDocuments} />
        </div>

        <div className="lg:col-span-1">
          <UsageChart data={usageData} />
        </div>
      </div>
    </div>
  );
}
