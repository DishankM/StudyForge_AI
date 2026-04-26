import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VivaSetsList } from "@/components/viva/viva-sets-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BrainCircuit,
  Clock3,
  MessageSquareQuote,
  Plus,
  Sparkles,
  Volume2,
} from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default async function VivaPage() {
  const session = await auth();

  const documents = await prisma.document.findMany({
    where: { userId: session!.user.id },
    orderBy: { uploadedAt: "desc" },
  });

  const vivaDocuments = documents.filter(
    (doc: any) => Array.isArray(doc.vivaQuestions) && doc.vivaQuestions.length > 0
  );
  const totalQuestions = vivaDocuments.reduce(
    (sum, doc: any) => sum + (Array.isArray(doc.vivaQuestions) ? doc.vivaQuestions.length : 0),
    0
  );
  const latestSet = vivaDocuments[0];
  const latestSetQuestionCount =
    latestSet && Array.isArray(latestSet.vivaQuestions) ? latestSet.vivaQuestions.length : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.14),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015)),rgba(9,9,11,0.92)] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.28)] sm:rounded-[30px] sm:p-8">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),transparent_48%)]" />
        <div className="relative grid gap-5 sm:gap-6 lg:grid-cols-[1.35fr_0.85fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1.5 text-xs text-orange-100 sm:px-4 sm:text-sm">
              <Volume2 className="h-4 w-4" />
              Viva Practice
            </div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:mt-5 sm:text-4xl">
              Practice speaking with question sets built from your material
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-300 sm:leading-7 sm:text-base">
              Use viva sets to rehearse oral answers, sharpen recall under pressure, and get more comfortable explaining concepts out loud before the real exam.
            </p>
            <div className="mt-5 sm:mt-6">
              <Link href="/dashboard/documents">
                <Button className="min-h-11 w-full bg-gradient-to-r from-orange-500 to-red-500 shadow-[0_12px_30px_rgba(249,115,22,0.24)] sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Generate from Document
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3.5 backdrop-blur-sm sm:p-4">
              <div className="flex items-center gap-2 text-orange-100">
                <Clock3 className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.22em] text-orange-100/80">Latest Set</span>
              </div>
              <p className="mt-3 line-clamp-2 text-sm font-semibold text-white sm:text-base">
                {latestSet ? latestSet.fileName : "Your next viva set will appear here"}
              </p>
              <p className="mt-1 text-sm text-gray-400">
                {latestSet
                  ? `${latestSetQuestionCount} oral questions ready for practice`
                  : "Generate viva questions from any document to start oral revision."}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3.5 backdrop-blur-sm sm:p-4">
              <div className="flex items-center gap-2 text-red-100">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.22em] text-red-100/80">Coverage</span>
              </div>
              <p className="mt-3 text-sm font-semibold text-white sm:text-base">
                {vivaDocuments.length} document{vivaDocuments.length === 1 ? "" : "s"} turned into speaking practice
              </p>
              <p className="mt-1 text-sm text-gray-400">
                Topic-specific oral prep sets linked to your uploaded material.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
        <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01)),rgba(24,24,27,0.92)] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-orange-500/10 p-2.5 sm:p-3">
              <Sparkles className="h-5 w-5 text-orange-300" />
            </div>
            <p className="text-sm text-gray-400">Total Sets</p>
          </div>
          <p className="mt-3 text-2xl font-bold text-white sm:mt-4 sm:text-3xl">{vivaDocuments.length}</p>
        </div>
        <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01)),rgba(24,24,27,0.92)] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-red-500/10 p-2.5 sm:p-3">
              <MessageSquareQuote className="h-5 w-5 text-red-300" />
            </div>
            <p className="text-sm text-gray-400">Questions Ready</p>
          </div>
          <p className="mt-3 text-2xl font-bold text-white sm:mt-4 sm:text-3xl">{totalQuestions.toLocaleString()}</p>
        </div>
        <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01)),rgba(24,24,27,0.92)] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:p-6 sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-amber-500/10 p-2.5 sm:p-3">
              <BrainCircuit className="h-5 w-5 text-amber-300" />
            </div>
            <p className="text-sm text-gray-400">Avg Questions/Set</p>
          </div>
          <p className="mt-3 text-2xl font-bold text-white sm:mt-4 sm:text-3xl">
            {vivaDocuments.length > 0 ? Math.round(totalQuestions / vivaDocuments.length).toLocaleString() : 0}
          </p>
        </div>
      </div>

      {vivaDocuments.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No viva sets yet"
          description="Generate viva questions from any uploaded document to build oral-exam practice with model answers and likely follow-up prompts."
          examples={["Lab viva prep", "Project defense talking points", "Theory subject oral revision"]}
          helperText="Viva sets are especially useful for subjects where you need to speak clearly from memory. Upload one topic-focused file and generate questions from that first."
          actionLabel="Generate viva questions"
          actionHref="/dashboard/upload?action=viva"
        />
      ) : (
        <VivaSetsList documents={vivaDocuments} />
      )}
    </div>
  );
}
