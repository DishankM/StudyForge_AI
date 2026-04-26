import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { McqDeleteButton } from "@/components/mcqs/mcq-delete-button";
import {
  BookOpenCheck,
  BrainCircuit,
  Clock3,
  ExternalLink,
  HelpCircle,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default async function MCQSetsPage() {
  const session = await auth();

  const mcqSets = await prisma.mcqSet.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
    include: { document: true },
  });

  const totalQuestions = mcqSets.reduce(
    (sum, set) => sum + (Array.isArray(set.questions) ? set.questions.length : 0),
    0
  );
  const totalDocuments = new Set(mcqSets.map((set) => set.documentId).filter(Boolean)).size;
  const latestSet = mcqSets[0];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.16),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015)),rgba(9,9,11,0.92)] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.28)] sm:rounded-[30px] sm:p-8">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),transparent_48%)]" />
        <div className="relative grid gap-5 sm:gap-6 lg:grid-cols-[1.35fr_0.85fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-3 py-1.5 text-xs text-fuchsia-100 sm:px-4 sm:text-sm">
              <BrainCircuit className="h-4 w-4" />
              Practice Arena
            </div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:mt-5 sm:text-4xl">
              Turn your material into active recall sessions
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-300 sm:leading-7 sm:text-base">
              Review every MCQ set in one place, jump into practice fast, and keep your revision focused on testing what you actually remember.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3.5 backdrop-blur-sm sm:p-4">
              <div className="flex items-center gap-2 text-pink-100">
                <Clock3 className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.22em] text-pink-100/80">Latest Set</span>
              </div>
              <p className="mt-3 line-clamp-2 text-sm font-semibold text-white sm:text-base">
                {latestSet ? latestSet.title : "Your next MCQ set will appear here"}
              </p>
              <p className="mt-1 text-sm text-gray-400">
                {latestSet
                  ? `${Array.isArray(latestSet.questions) ? latestSet.questions.length : 0} questions ready for practice`
                  : "Generate MCQs from any document to begin practicing."}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3.5 backdrop-blur-sm sm:p-4">
              <div className="flex items-center gap-2 text-violet-100">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.22em] text-violet-100/80">Coverage</span>
              </div>
              <p className="mt-3 text-sm font-semibold text-white sm:text-base">
                {totalDocuments} source document{totalDocuments === 1 ? "" : "s"}
              </p>
              <p className="mt-1 text-sm text-gray-400">
                Practice sets linked to your uploaded study material.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
        <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01)),rgba(24,24,27,0.92)] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-pink-500/10 p-2.5 sm:p-3">
              <HelpCircle className="h-5 w-5 text-pink-300" />
            </div>
            <p className="text-sm text-gray-400">Total Sets</p>
          </div>
          <p className="mt-3 text-2xl font-bold text-white sm:mt-4 sm:text-3xl">{mcqSets.length}</p>
        </div>
        <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01)),rgba(24,24,27,0.92)] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-violet-500/10 p-2.5 sm:p-3">
              <BookOpenCheck className="h-5 w-5 text-violet-300" />
            </div>
            <p className="text-sm text-gray-400">Total Questions</p>
          </div>
          <p className="mt-3 text-2xl font-bold text-white sm:mt-4 sm:text-3xl">{totalQuestions.toLocaleString()}</p>
        </div>
        <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01)),rgba(24,24,27,0.92)] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:p-6 sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-fuchsia-500/10 p-2.5 sm:p-3">
              <PlayCircle className="h-5 w-5 text-fuchsia-300" />
            </div>
            <p className="text-sm text-gray-400">Avg Questions/Set</p>
          </div>
          <p className="mt-3 text-2xl font-bold text-white sm:mt-4 sm:text-3xl">
            {mcqSets.length > 0 ? Math.round(totalQuestions / mcqSets.length).toLocaleString() : 0}
          </p>
        </div>
      </div>

      {mcqSets.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title="No MCQ sets yet"
          description="Generate multiple-choice practice sets from your uploaded documents and start testing recall with instant explanations."
          examples={["Chapter recap quiz", "Unit-wise revision set", "Past-paper style practice"]}
          helperText="MCQs work best after you already have a rough understanding of the topic. If you are starting cold, generate notes first and then come back for practice."
          actionLabel="Generate MCQs"
          actionHref="/dashboard/upload?action=mcqs"
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
          {mcqSets.map((set) => {
            const questionCount = Array.isArray(set.questions) ? set.questions.length : 0;

            return (
              <div
                key={set.id}
                className="group overflow-hidden rounded-[22px] border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(217,70,239,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.012)),rgba(24,24,27,0.92)] p-0 shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:border-fuchsia-400/30 sm:rounded-[26px]"
              >
                <div className="border-b border-white/10 p-5 sm:p-6">
                  <div className="mb-4 flex items-start justify-between gap-2 sm:gap-3">
                    <div className="flex min-w-0 flex-1 items-start gap-2.5 sm:gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg shadow-fuchsia-950/40 sm:h-11 sm:w-11">
                        <HelpCircle className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-fuchsia-100">
                            {set.difficulty}
                          </span>
                        </div>
                        <h2 className="mt-3 line-clamp-2 text-base font-semibold text-white">{set.title}</h2>
                        <p className="mt-2 text-sm text-gray-400">
                          {questionCount} question{questionCount === 1 ? "" : "s"} ready for practice
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm leading-6 text-gray-300 sm:leading-7">
                    Open the full set to review questions one by one, or jump straight into practice mode for an active recall session.
                  </p>
                </div>

                <div className="space-y-4 p-5 sm:space-y-5 sm:p-6">
                  <div className="grid grid-cols-2 gap-2.5 text-sm sm:gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Questions</p>
                      <p className="mt-2 font-medium text-white">{questionCount.toLocaleString()}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Difficulty</p>
                      <p className="mt-2 font-medium capitalize text-white">{set.difficulty}</p>
                    </div>
                  </div>

                  {set.document && (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 sm:p-4">
                      <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-gray-500">Source document</p>
                      <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-white/5 p-2">
                          <BookOpenCheck className="h-4 w-4 text-fuchsia-300" />
                        </div>
                        <div className="min-w-0">
                          <p className="line-clamp-2 text-sm leading-6 text-gray-300">{set.document.fileName}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-3 pt-1 md:grid-cols-2">
                    <Link href={`/dashboard/mcqs/${set.id}`} className="block">
                      <Button
                        variant="outline"
                        className="h-11 w-full border-white/10 bg-white/[0.02] text-white shadow-[0_10px_30px_rgba(0,0,0,0.12)] hover:border-fuchsia-400/30 hover:bg-fuchsia-400/10 sm:h-12"
                        size="sm"
                      >
                        View set
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/mcqs/${set.id}/practice`} className="block">
                      <Button
                        size="sm"
                        className="h-11 w-full bg-gradient-to-r from-pink-500 to-purple-600 shadow-[0_10px_30px_rgba(168,85,247,0.28)] sm:h-12"
                      >
                        Start practice
                        <PlayCircle className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  <div className="border-t border-white/10 pt-2">
                    <McqDeleteButton
                      mcqSetId={set.id}
                      variant="ghost"
                      size="sm"
                      className="min-h-10 w-full justify-center text-red-400 hover:text-red-300 sm:min-h-11"
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
