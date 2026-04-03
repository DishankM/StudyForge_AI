import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText, MessageSquareQuote, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function VivaPracticePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  const document = await prisma.document.findFirst({
    where: { id: params.id, userId: session!.user.id },
  });

  const questions = (document as any)?.vivaQuestions;

  if (!document || !Array.isArray(questions) || questions.length === 0) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950/80 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.18),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.14),_transparent_32%)]" />
        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-300">
              <MessageSquareQuote className="h-4 w-4 text-orange-300" />
              Viva practice
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-white md:text-4xl">Viva Practice</h1>
            <p className="mt-3 text-base text-gray-300">
              {questions.length} oral-exam questions generated from {document.fileName}.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-gray-400">Question set</p>
              <p className="mt-2 text-3xl font-semibold text-white">{questions.length}</p>
              <p className="mt-1 text-sm text-gray-400">Practice prompts ready to review</p>
            </div>
            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-orange-200">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.24em]">Model answers included</span>
              </div>
              <p className="mt-2 text-sm text-orange-100/90">
                Use the model answers to sharpen your own spoken response structure.
              </p>
            </div>
          </div>
        </div>

        <div className="relative mt-6">
          <Link href="/dashboard/viva">
            <Button variant="outline">Back to Viva</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((item: any, index: number) => (
          <div
            key={item.id || `${document.id}-${index}`}
            className="rounded-[26px] border border-white/10 bg-zinc-950/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.24)]"
          >
            <div className="mb-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-orange-500/10 p-3">
                  <FileText className="h-5 w-5 text-orange-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">Q{index + 1}</h2>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-400">
                {item.difficulty || "general"}
              </span>
            </div>

            <p className="text-gray-200">{item.question}</p>

            {item.answer && (
              <div className="mt-4 rounded-2xl border border-white/10 bg-zinc-800/60 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-gray-500">Model answer</p>
                <p className="mt-2 text-sm leading-7 text-gray-300">{item.answer}</p>
              </div>
            )}

            {item.topic && (
              <p className="mt-3 text-xs text-gray-500">Topic: {item.topic}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
