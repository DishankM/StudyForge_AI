import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, HelpCircle, ExternalLink, Sparkles } from "lucide-react";

export function GeneratedContent({ document }: { document: any }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Generated Content</h2>

      {document.notes.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-zinc-900 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-blue-400" />
              <h3 className="font-semibold">Study Notes</h3>
            </div>
            <span className="text-sm text-gray-400">
              {document.notes.length} generated
            </span>
          </div>
          <div className="space-y-3">
            {document.notes.map((note: any) => (
              <div
                key={note.id}
                className="flex items-center justify-between rounded-lg bg-zinc-800/50 p-4"
              >
                <div>
                  <p className="font-medium">{note.title}</p>
                  <p className="text-sm text-gray-400">
                    {note.wordCount} words • {note.format}
                  </p>
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
        <div className="rounded-xl border border-white/10 bg-zinc-900 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-5 w-5 text-purple-400" />
              <h3 className="font-semibold">MCQ Sets</h3>
            </div>
            <span className="text-sm text-gray-400">
              {document.mcqSets.length} sets
            </span>
          </div>
          <div className="space-y-3">
            {document.mcqSets.map((set: any) => (
              <div
                key={set.id}
                className="flex items-center justify-between rounded-lg bg-zinc-800/50 p-4"
              >
                <div>
                  <p className="font-medium">{set.title}</p>
                  <p className="text-sm text-gray-400">
                    {set.questions.length} questions • {set.difficulty}
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
        <div className="rounded-xl border border-white/10 bg-zinc-900 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-orange-400" />
              <h3 className="font-semibold">Viva Questions</h3>
            </div>
            <span className="text-sm text-gray-400">
              {document.vivaQuestions.length} questions
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-zinc-800/50 p-4">
            <div>
              <p className="font-medium">Practice set</p>
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
        <div className="rounded-xl border border-white/10 bg-zinc-900 py-12 text-center">
          <p className="text-gray-400">
            No content generated yet. Use the buttons above to get started!
          </p>
        </div>
      )}
    </div>
  );
}
