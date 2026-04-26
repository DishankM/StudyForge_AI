import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BookOpenCheck,
  Clock3,
  ExternalLink,
  FileSignature,
  GraduationCap,
  PenSquare,
  Sparkles,
} from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default async function ExamPapersPage() {
  const session = await auth();

  const examPapers = await prisma.examPaper.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
  });

  const totalMarks = examPapers.reduce((sum, paper) => sum + paper.totalMarks, 0);
  const totalMinutes = examPapers.reduce((sum, paper) => sum + paper.duration, 0);
  const latestPaper = examPapers[0];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(234,179,8,0.14),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015)),rgba(9,9,11,0.92)] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.28)] sm:rounded-[30px] sm:p-8">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),transparent_48%)]" />
        <div className="relative grid gap-5 sm:gap-6 lg:grid-cols-[1.35fr_0.85fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-100 sm:px-4 sm:text-sm">
              <GraduationCap className="h-4 w-4" />
              Exam Studio
            </div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:mt-5 sm:text-4xl">
              Build realistic papers for final-stage revision
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-300 sm:leading-7 sm:text-base">
              Create and revisit university-style exam papers in one place. This view now matches the same polished library feel as notes and MCQs, with fast access to your mock-paper collection.
            </p>
            <div className="mt-5 sm:mt-6">
              <Link href="/dashboard/exam-papers/create">
                <Button className="min-h-11 w-full bg-gradient-to-r from-emerald-500 to-lime-500 text-zinc-950 shadow-[0_12px_30px_rgba(34,197,94,0.24)] sm:w-auto">
                  <PenSquare className="mr-2 h-4 w-4" />
                  Create Exam Paper
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3.5 backdrop-blur-sm sm:p-4">
              <div className="flex items-center gap-2 text-emerald-100">
                <Clock3 className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.22em] text-emerald-100/80">Latest Paper</span>
              </div>
              <p className="mt-3 line-clamp-2 text-sm font-semibold text-white sm:text-base">
                {latestPaper ? latestPaper.title : "Your next exam paper will appear here"}
              </p>
              <p className="mt-1 text-sm text-gray-400">
                {latestPaper
                  ? `${latestPaper.duration} minutes and ${latestPaper.totalMarks} marks`
                  : "Create your first mock paper to start timed revision."}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3.5 backdrop-blur-sm sm:p-4">
              <div className="flex items-center gap-2 text-lime-100">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.22em] text-lime-100/80">Coverage</span>
              </div>
              <p className="mt-3 text-sm font-semibold text-white sm:text-base">
                {examPapers.length} paper{examPapers.length === 1 ? "" : "s"} in your exam prep library
              </p>
              <p className="mt-1 text-sm text-gray-400">
                Practice-ready mock papers for higher-pressure revision sessions.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
        <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01)),rgba(24,24,27,0.92)] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-500/10 p-2.5 sm:p-3">
              <GraduationCap className="h-5 w-5 text-emerald-300" />
            </div>
            <p className="text-sm text-gray-400">Total Papers</p>
          </div>
          <p className="mt-3 text-2xl font-bold text-white sm:mt-4 sm:text-3xl">{examPapers.length}</p>
        </div>
        <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01)),rgba(24,24,27,0.92)] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-lime-500/10 p-2.5 sm:p-3">
              <BookOpenCheck className="h-5 w-5 text-lime-300" />
            </div>
            <p className="text-sm text-gray-400">Total Marks</p>
          </div>
          <p className="mt-3 text-2xl font-bold text-white sm:mt-4 sm:text-3xl">{totalMarks.toLocaleString()}</p>
        </div>
        <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01)),rgba(24,24,27,0.92)] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:p-6 sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-yellow-500/10 p-2.5 sm:p-3">
              <Clock3 className="h-5 w-5 text-yellow-300" />
            </div>
            <p className="text-sm text-gray-400">Avg Duration</p>
          </div>
          <p className="mt-3 text-2xl font-bold text-white sm:mt-4 sm:text-3xl">
            {examPapers.length > 0 ? Math.round(totalMinutes / examPapers.length).toLocaleString() : 0} min
          </p>
        </div>
      </div>

      {examPapers.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No exam papers yet"
          description="Turn your subjects or uploaded source material into structured university-style exam papers you can practice under time pressure."
          examples={["Internal test mock paper", "University-style final exam", "Subject practice paper with answer flow"]}
          helperText="Exam papers work best once you already know the syllabus or have studied notes. Use them later in the revision cycle to simulate real exam conditions."
          actionLabel="Create your first exam paper"
          actionHref="/dashboard/exam-papers/create"
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
          {examPapers.map((paper) => {
            const sectionsCount = Array.isArray(paper.sections) ? paper.sections.length : 0;
            const questionsCount = Array.isArray(paper.questions) ? paper.questions.length : 0;

            return (
              <div
                key={paper.id}
                className="group overflow-hidden rounded-[22px] border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.012)),rgba(24,24,27,0.92)] p-0 shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/30 sm:rounded-[26px]"
              >
                <div className="border-b border-white/10 p-5 sm:p-6">
                  <div className="mb-4 flex items-start gap-2.5 sm:gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-lime-500 shadow-lg shadow-emerald-950/40 sm:h-11 sm:w-11">
                      <FileSignature className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-emerald-100">
                          {paper.template}
                        </span>
                      </div>
                      <h2 className="mt-3 line-clamp-2 text-base font-semibold text-white">{paper.title}</h2>
                      <p className="mt-2 line-clamp-2 text-sm text-gray-400">
                        {paper.university}
                        {paper.subject ? ` · ${paper.subject}` : ""}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm leading-6 text-gray-300 sm:leading-7">
                    Review the paper structure, scan the questions, and use it as a realistic mock exam for timed revision.
                  </p>
                </div>

                <div className="space-y-4 p-5 sm:space-y-5 sm:p-6">
                  <div className="grid grid-cols-2 gap-2.5 text-sm sm:gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Duration</p>
                      <p className="mt-2 font-medium text-white">{paper.duration} min</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Marks</p>
                      <p className="mt-2 font-medium text-white">{paper.totalMarks}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 sm:p-4">
                    <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-gray-500">Paper structure</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">Sections</p>
                        <p className="mt-1 text-sm font-medium text-gray-200">{sectionsCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Questions</p>
                        <p className="mt-1 text-sm font-medium text-gray-200">{questionsCount}</p>
                      </div>
                    </div>
                  </div>

                  <Link href={`/dashboard/exam-papers/${paper.id}`} className="block pt-1">
                    <Button
                      variant="outline"
                      className="h-11 w-full border-white/10 bg-white/[0.02] text-white shadow-[0_10px_30px_rgba(0,0,0,0.12)] hover:border-emerald-400/30 hover:bg-emerald-400/10 sm:h-12"
                      size="sm"
                    >
                      View exam paper
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
