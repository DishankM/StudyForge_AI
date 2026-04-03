import Link from "next/link";
import { ExternalLink, FileText, HelpCircle, Sparkles } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export function GeneratedContent({ document }: { document: any }) {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Generated Content</h2>
          <p className="mt-1 text-sm text-gray-400">
            Everything built from this document, ready for practice or review.
          </p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-gray-400">
          Output Hub
        </div>
      </div>

      {document.notes.length > 0 && (
        <div className="rounded-[26px] border border-white/10 bg-zinc-950/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
          <div className="mb-4 flex items-center justify-between">
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
                className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] p-4"
              >
                <div>
                  <p className="font-medium text-white">{note.title}</p>
                  <p className="text-sm text-gray-400">{note.wordCount} words - {note.format}</p>
                </div>
                <Link href={`/dashboard/notes/${note.id}`}>
                  <Button variant="ghost" size="sm">
                    View <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {document.mcqSets.length > 0 && (
        <div className="rounded-[26px] border border-white/10 bg-zinc-950/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
          <div className="mb-4 flex items-center justify-between">
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
                className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] p-4"
              >
                <div>
                  <p className="font-medium text-white">{set.title}</p>
                  <p className="text-sm text-gray-400">
                    {set.questions.length} questions - {set.difficulty}
                  </p>
                </div>
                <Link href={`/dashboard/mcqs/${set.id}`}>
                  <Button variant="ghost" size="sm">
                    Practice <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {Array.isArray(document.vivaQuestions) && document.vivaQuestions.length > 0 && (
        <div className="rounded-[26px] border border-white/10 bg-zinc-950/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
          <div className="mb-4 flex items-center justify-between">
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
          <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] p-4">
            <div>
              <p className="font-medium text-white">Practice set</p>
              <p className="text-sm text-gray-400">Oral exam prep</p>
            </div>
            <Link href={`/dashboard/viva/${document.id}/practice`}>
              <Button variant="ghost" size="sm">
                Practice <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {document.notes.length === 0 &&
        document.mcqSets.length === 0 &&
        (!Array.isArray(document.vivaQuestions) || document.vivaQuestions.length === 0) && (
          <EmptyState
            icon={Sparkles}
            title="No generated content yet"
            description="Use the generation actions above to turn this document into notes, MCQs, or viva practice."
            actionLabel="Generate from this document"
            actionHref="#document-actions"
          />
        )}
    </div>
  );
}
