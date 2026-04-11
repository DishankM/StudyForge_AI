import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { RoadmapDeleteButton } from "@/components/revision/roadmap-delete-button";
import { Map, Calendar } from "lucide-react";
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

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Exam roadmap</h1>
          <p className="mt-2 text-gray-400">
            AI-built study plans from your syllabus or uploads—units, priorities, phases, and a practical daily schedule.
          </p>
        </div>
        <Button asChild className="w-full bg-gradient-to-r from-pink-500 to-purple-600 sm:w-auto">
          <Link href="/dashboard/revision/new">
            <Map className="mr-2 h-4 w-4" />
            New roadmap
          </Link>
        </Button>
      </div>

      {roadmaps.length === 0 ? (
        <EmptyState
          icon={Map}
          title="No roadmaps yet"
          description="Generate a personalized exam roadmap from your documents or pasted syllabus. You will get unit priorities, high-yield topics, phased goals, and a day-by-day plan."
          actionLabel="Create your first roadmap"
          actionHref="/dashboard/revision/new"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {roadmaps.map((row) => {
            const prep = PREP_LABELS[row.preparationLevel as PreparationLevel] ?? row.preparationLevel;
            return (
              <div
                key={row.id}
                className="flex flex-col rounded-2xl border border-white/10 bg-zinc-900/80 p-6 shadow-[0_16px_48px_rgba(0,0,0,0.2)]"
              >
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-white">{row.title}</h2>
                  <p className="mt-1 text-sm text-gray-400">{row.subjectName}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(row.examDate, "MMM d, yyyy")}
                    </span>
                    <span>{row.daysUntilExam} days out</span>
                    <span>{row.studyHoursPerDay}h/day</span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">{prep}</p>
                  {row.document?.fileName && (
                    <p className="mt-2 text-xs text-gray-600">From {row.document.fileName}</p>
                  )}
                </div>
                <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                  <Link href={`/dashboard/revision/${row.id}`}>
                    <Button variant="outline" size="sm">
                      Open
                    </Button>
                  </Link>
                  <RoadmapDeleteButton
                    roadmapId={row.id}
                    redirectTo=""
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
