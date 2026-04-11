import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RoadmapViewer } from "@/components/revision/roadmap-viewer";
import { RoadmapDeleteButton } from "@/components/revision/roadmap-delete-button";
import { parseRevisionRoadmapJson } from "@/lib/types/revision-roadmap";
import type { PreparationLevel } from "@/lib/types/revision-roadmap";
import { ArrowLeft } from "lucide-react";

const PREP_LABELS: Record<PreparationLevel, string> = {
  "just-starting": "Just starting",
  "somewhat-prepared": "Somewhat prepared",
  "revision-mode": "Revision mode",
};

export default async function RevisionRoadmapDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  const record = await prisma.revisionRoadmap.findFirst({
    where: {
      id: params.id,
      userId: session!.user.id,
    },
    include: {
      document: { select: { fileName: true } },
    },
  });

  if (!record) {
    notFound();
  }

  const roadmap = parseRevisionRoadmapJson(record.roadmap);
  if (!roadmap) {
    notFound();
  }

  const prepLabel =
    PREP_LABELS[record.preparationLevel as PreparationLevel] ?? record.preparationLevel;
  const sourceLabel = record.document?.fileName ?? null;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" size="sm" asChild className="-ml-2 w-fit text-gray-400 hover:text-white">
          <Link href="/dashboard/revision">
            <ArrowLeft className="mr-2 h-4 w-4" />
            All roadmaps
          </Link>
        </Button>
        <RoadmapDeleteButton roadmapId={record.id} />
      </div>
      <RoadmapViewer
        roadmap={roadmap}
        subjectName={record.subjectName}
        examDate={record.examDate}
        daysUntilExam={record.daysUntilExam}
        studyHoursPerDay={record.studyHoursPerDay}
        preparationLevelLabel={prepLabel}
        sourceLabel={sourceLabel}
      />
    </div>
  );
}
