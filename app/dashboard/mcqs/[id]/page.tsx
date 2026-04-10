import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { McqDeleteButton } from "@/components/mcqs/mcq-delete-button";
import { HelpCircle, Sparkles } from "lucide-react";

export default async function MCQSetDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  const mcqSet = await prisma.mcqSet.findFirst({
    where: {
      id: params.id,
      userId: session!.user.id,
    },
    include: {
      document: true,
    },
  });

  if (!mcqSet) {
    notFound();
  }

  const questionsCount = Array.isArray(mcqSet.questions)
    ? mcqSet.questions.length
    : 0;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950/80 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-6 lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.18),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.14),_transparent_32%)]" />
        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-300">
              <HelpCircle className="h-4 w-4 text-purple-300" />
              MCQ set
            </div>
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">{mcqSet.title}</h1>
            <p className="mt-3 text-base text-gray-300">
              {questionsCount} questions in {mcqSet.difficulty} mode, ready for timed practice and answer review.
            </p>
            {mcqSet.document?.fileName && (
              <p className="mt-2 text-sm text-gray-400">Built from {mcqSet.document.fileName}</p>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-gray-400">Question count</p>
              <p className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{questionsCount}</p>
              <p className="mt-1 text-sm text-gray-400">Generated for focused practice</p>
            </div>
            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-orange-200">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.24em]">Practice ready</span>
              </div>
              <p className="mt-2 text-sm text-orange-100/90">
                Attempt the full set with a timer, instant explanations, and final review.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[26px] border border-white/10 bg-zinc-950/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
        <h2 className="text-lg font-semibold sm:text-xl">Start Practice</h2>
        <p className="mt-2 text-gray-400">
          Attempt the full quiz with timer, explanations, and results.
        </p>
        <div className="mt-4">
          <Link href={`/dashboard/mcqs/${mcqSet.id}/practice`}>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600">
              Start Practice
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
        <h2 className="text-lg font-semibold text-red-400 sm:text-xl">Delete MCQ set</h2>
        <p className="mt-2 text-sm text-red-300/80">
          This will permanently remove the MCQ set.
        </p>
        <div className="mt-4">
          <McqDeleteButton
            mcqSetId={mcqSet.id}
            variant="ghost"
            size="sm"
            className="border border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20"
            label="Delete"
          />
        </div>
      </div>
    </div>
  );
}
