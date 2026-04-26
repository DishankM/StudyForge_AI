import Link from "next/link";
import { ExternalLink, FileText, HelpCircle, Map, Sparkles } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export function GeneratedContent({ document }: { document: any }) {
  const hasNotes = document.notes.length > 0;
  const hasMcqs = document.mcqSets.length > 0;
  const hasViva = Array.isArray(document.vivaQuestions) && document.vivaQuestions.length > 0;
  const hasRoadmaps = Array.isArray(document.revisionRoadmaps) && document.revisionRoadmaps.length > 0;
  const nextPrompt = !hasNotes
    ? {
        title: "Start with notes",
        description: "Notes give you the fastest first pass through the material before you move into testing.",
        href: "#document-actions",
        actionLabel: "Generate notes",
      }
    : !hasMcqs
      ? {
          title: "Turn reading into recall",
          description: "You already have notes. Create MCQs next to check what actually stuck.",
          href: "#document-actions",
          actionLabel: "Generate MCQs",
        }
      : !hasViva
        ? {
            title: "Add oral practice",
            description: "MCQs test recall well. Viva questions help you explain concepts clearly under pressure.",
            href: "#document-actions",
            actionLabel: "Generate viva",
          }
        : !hasRoadmaps
          ? {
              title: "Wrap this into a plan",
              description: "You have learning assets ready. Create a revision roadmap to turn them into a schedule.",
              href: `/dashboard/revision/new?documentId=${document.id}`,
              actionLabel: "Create roadmap",
            }
          : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white sm:text-xl">Generated Content</h2>
          <p className="mt-1 text-sm text-gray-400">
            Everything built from this document, ready for practice or review.
          </p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-gray-400">
          Output Hub
        </div>
      </div>

      {nextPrompt && (
        <div className="rounded-[24px] border border-cyan-500/20 bg-cyan-500/10 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Next best step</p>
              <p className="mt-1 font-semibold text-white">{nextPrompt.title}</p>
              <p className="mt-1 text-sm text-cyan-100/80">{nextPrompt.description}</p>
            </div>
            <Button asChild variant="ghost" size="sm" className="w-full border border-cyan-400/20 bg-cyan-500/10 text-cyan-100 hover:bg-cyan-500/20 sm:w-auto">
              {nextPrompt.href.startsWith("#") ? (
                <a href={nextPrompt.href}>
                  {nextPrompt.actionLabel} <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              ) : (
                <Link href={nextPrompt.href}>
                  {nextPrompt.actionLabel} <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              )}
            </Button>
          </div>
        </div>
      )}

      {hasNotes && (
        <div className="rounded-[26px] border border-white/10 bg-zinc-950/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-blue-500/10 p-3">
                <FileText className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="font-semibold">Study Notes</h3>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-gray-300">
              {document.notes.length} generated
            </span>
          </div>
          <div className="space-y-3">
            {document.notes.map((note: any) => (
              <div
                key={note.id}
                className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-white">{note.title}</p>
                  <p className="text-sm text-gray-400">{note.wordCount} words - {note.format}</p>
                </div>
                <Link href={`/dashboard/notes/${note.id}`}>
                  <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                    View <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasMcqs && (
        <div className="rounded-[26px] border border-white/10 bg-zinc-950/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-purple-500/10 p-3">
                <HelpCircle className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="font-semibold">MCQ Sets</h3>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-gray-300">
              {document.mcqSets.length} sets
            </span>
          </div>
          <div className="space-y-3">
            {document.mcqSets.map((set: any) => (
              <div
                key={set.id}
                className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-white">{set.title}</p>
                  <p className="text-sm text-gray-400">
                    {set.questions.length} questions - {set.difficulty}
                  </p>
                </div>
                <Link href={`/dashboard/mcqs/${set.id}`}>
                  <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                    Practice <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasViva && (
        <div className="rounded-[26px] border border-white/10 bg-zinc-950/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-orange-500/10 p-3">
                <Sparkles className="h-5 w-5 text-orange-400" />
              </div>
              <h3 className="font-semibold">Viva Questions</h3>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-gray-300">
              {document.vivaQuestions.length} questions
            </span>
          </div>
          <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-white">Practice set</p>
              <p className="text-sm text-gray-400">Oral exam prep</p>
            </div>
            <Link href={`/dashboard/viva/${document.id}/practice`}>
              <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                Practice <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {hasRoadmaps && (
        <div className="rounded-[26px] border border-white/10 bg-zinc-950/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-500/10 p-3">
                <Map className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="font-semibold">Revision Roadmaps</h3>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-gray-300">
              {document.revisionRoadmaps.length} roadmap{document.revisionRoadmaps.length === 1 ? "" : "s"}
            </span>
          </div>
          <div className="space-y-3">
            {document.revisionRoadmaps.map((roadmap: any) => (
              <div
                key={roadmap.id}
                className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-white">{roadmap.title}</p>
                  <p className="text-sm text-gray-400">
                    {roadmap.examDate
                      ? `Exam date: ${new Date(roadmap.examDate).toLocaleDateString()}`
                      : "Structured revision plan"}
                  </p>
                </div>
                <Link href={`/dashboard/revision/${roadmap.id}`}>
                  <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                    View <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {!hasNotes &&
        !hasMcqs &&
        !hasViva &&
        !hasRoadmaps && (
          <EmptyState
            icon={Sparkles}
            title="No generated content yet"
            description="Use the journey above to turn this document into notes, MCQs, viva practice, and a revision plan from the same source file."
            examples={["Start with notes for quick revision", "Generate MCQs for active recall", "Create viva questions for oral prep"]}
            helperText="A strong default flow is notes first, MCQs second, viva third, roadmap last. That gives you summary, recall, speaking practice, and a revision schedule from one upload."
            actionLabel="Generate from this document"
            actionHref="#document-actions"
          />
        )}
    </div>
  );
}
