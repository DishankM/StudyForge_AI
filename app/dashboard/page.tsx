import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardStats } from "@/components/dashboard/stats";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { UsageChart } from "@/components/dashboard/usage-chart";

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {session!.user.name || "Student"}!</h1>
        <p className="mt-2 text-gray-400">Here&apos;s what&apos;s happening with your studies today.</p>
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
