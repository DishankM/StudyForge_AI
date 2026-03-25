import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardStats } from "@/components/dashboard/stats";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { UsageChart } from "@/components/dashboard/usage-chart";

export default async function DashboardPage() {
  const session = await auth();

  const [documentsCount, notesCount, mcqCount, examPapersCount] = await Promise.all([
    prisma.document.count({ where: { userId: session!.user.id } }),
    prisma.note.count({ where: { userId: session!.user.id } }),
    prisma.mcqSet.count({ where: { userId: session!.user.id } }),
    prisma.examPaper.count({ where: { userId: session!.user.id } }),
  ]);

  const recentDocuments = await prisma.document.findMany({
    where: { userId: session!.user.id },
    orderBy: { uploadedAt: "desc" },
    take: 5,
  });

  const now = new Date();
  const weekRanges = Array.from({ length: 4 }, (_, index) => {
    const start = new Date(now);
    start.setDate(start.getDate() - (3 - index) * 7);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    return { start, end };
  });

  const weeklyTotals = await Promise.all(
    weekRanges.map(async (range) => {
      const [docs, notes, mcqs, exams] = await Promise.all([
        prisma.document.count({
          where: { userId: session!.user.id, uploadedAt: { gte: range.start, lt: range.end } },
        }),
        prisma.note.count({
          where: { userId: session!.user.id, createdAt: { gte: range.start, lt: range.end } },
        }),
        prisma.mcqSet.count({
          where: { userId: session!.user.id, createdAt: { gte: range.start, lt: range.end } },
        }),
        prisma.examPaper.count({
          where: { userId: session!.user.id, createdAt: { gte: range.start, lt: range.end } },
        }),
      ]);
      return docs + notes + mcqs + exams;
    })
  );

  const maxWeekly = Math.max(1, ...weeklyTotals);
  const usageData = weekRanges.map((range, index) => {
    const label = range.start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const total = weeklyTotals[index];
    return {
      label,
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
