import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { DocumentActions } from "@/components/documents/document-actions";
import { DocumentInfo } from "@/components/documents/document-info";
import { GeneratedContent } from "@/components/documents/generated-content";
import { StudyJourney } from "@/components/documents/study-journey";
import { FileText, Sparkles } from "lucide-react";

type JourneyAction = "notes" | "mcqs" | "viva" | "revision-roadmap";
type RecommendedAction = "notes" | "mcqs" | "viva" | "revision-pack" | null;

export default async function DocumentDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { action?: string };
}) {
  const session = await auth();

  const document = await prisma.document.findFirst({
    where: {
      id: params.id,
      userId: session!.user.id,
    },
    include: {
      notes: true,
      mcqSets: true,
      revisionRoadmaps: {
        select: {
          id: true,
          title: true,
          examDate: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!document) {
    notFound();
  }

  const explicitRecommendedAction =
    searchParams?.action === "notes" ||
    searchParams?.action === "mcqs" ||
    searchParams?.action === "viva" ||
    searchParams?.action === "revision-pack"
      ? searchParams.action
      : null;
  const documentJourney: Array<{
    id: JourneyAction;
    title: string;
    completed: boolean;
    href: string;
    actionLabel: string;
  }> = [
    {
      id: "notes",
      title: "Read notes",
      completed: document.notes.length > 0,
      href: document.notes[0]
        ? `/dashboard/notes/${document.notes[0].id}`
        : `/dashboard/documents/${document.id}?action=notes#document-actions`,
      actionLabel: document.notes.length > 0 ? "Open notes" : "Generate notes",
    },
    {
      id: "mcqs",
      title: "Practice MCQs",
      completed: document.mcqSets.length > 0,
      href: document.mcqSets[0]
        ? `/dashboard/mcqs/${document.mcqSets[0].id}/practice`
        : `/dashboard/documents/${document.id}?action=mcqs#document-actions`,
      actionLabel: document.mcqSets.length > 0 ? "Start practice" : "Generate MCQs",
    },
    {
      id: "viva",
      title: "Review viva questions",
      completed: Array.isArray(document.vivaQuestions) && document.vivaQuestions.length > 0,
      href:
        Array.isArray(document.vivaQuestions) && document.vivaQuestions.length > 0
          ? `/dashboard/viva/${document.id}/practice`
          : `/dashboard/documents/${document.id}?action=viva#document-actions`,
      actionLabel:
        Array.isArray(document.vivaQuestions) && document.vivaQuestions.length > 0
          ? "Open viva set"
          : "Generate viva",
    },
    {
      id: "revision-roadmap",
      title: "Create revision roadmap",
      completed: document.revisionRoadmaps.length > 0,
      href: document.revisionRoadmaps[0]
        ? `/dashboard/revision/${document.revisionRoadmaps[0].id}`
        : `/dashboard/revision/new?documentId=${document.id}`,
      actionLabel: document.revisionRoadmaps.length > 0 ? "Open roadmap" : "Create roadmap",
    },
  ];
  const nextJourneyStep = documentJourney.find((step) => !step.completed);
  const journeyRecommendedAction: RecommendedAction =
    nextJourneyStep?.id === "revision-roadmap"
      ? null
      : nextJourneyStep?.id === "notes" || nextJourneyStep?.id === "mcqs" || nextJourneyStep?.id === "viva"
        ? nextJourneyStep.id
        : null;
  const recommendedAction = explicitRecommendedAction ?? journeyRecommendedAction;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950/80 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-6 lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.18),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.14),_transparent_32%)]" />
        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-300">
              <FileText className="h-4 w-4 text-pink-300" />
              Source document
            </div>
            <h1 className="mt-5 break-words text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">{document.fileName}</h1>
            <p className="mt-3 text-base text-gray-300">
              Uploaded {new Date(document.uploadedAt).toLocaleDateString()}.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-gray-400">Generated Outputs</p>
              <p className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                {document.notes.length +
                  document.mcqSets.length +
                  (Array.isArray(document.vivaQuestions) ? 1 : 0) +
                  document.revisionRoadmaps.length}
              </p>
              <p className="mt-1 text-sm text-gray-400">Assets already created from this file</p>
            </div>
            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-orange-200">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.24em]">Current Focus</span>
              </div>
              <p className="mt-2 text-sm text-orange-100/90">
                {nextJourneyStep
                  ? `Next study step: ${nextJourneyStep.title}.`
                  : "Core study flow complete. Reopen any output when you want another round."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <DocumentInfo document={document} />
        </div>

        <div className="space-y-6 lg:col-span-2">
          <StudyJourney steps={documentJourney} nextStep={nextJourneyStep} />
          <div id="document-actions">
            <DocumentActions
              documentId={document.id}
              recommendedAction={recommendedAction}
              document={{
                fileName: document.fileName,
                fileSize: document.fileSize,
                mimeType: document.mimeType,
                documentType: document.documentType,
              }}
            />
          </div>
          <GeneratedContent document={document} />
        </div>
      </div>
    </div>
  );
}
