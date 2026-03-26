import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { McqDeleteButton } from "@/components/mcqs/mcq-delete-button";

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

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{mcqSet.title}</h1>
        <p className="mt-2 text-gray-400">
          {(mcqSet.questions ?? []).length} questions - {mcqSet.difficulty}
        </p>
        {mcqSet.document?.fileName && (
          <p className="mt-1 text-sm text-gray-500">From {mcqSet.document.fileName}</p>
        )}
      </div>

      <div className="rounded-xl border border-white/10 bg-zinc-900 p-6">
        <h2 className="text-xl font-semibold">Start Practice</h2>
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
        <h2 className="text-xl font-semibold text-red-400">Delete MCQ set</h2>
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
