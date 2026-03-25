import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { McqDeleteButton } from "@/components/mcqs/mcq-delete-button";

export default async function MCQSetsPage() {
  const session = await auth();

  const mcqSets = await prisma.mcqSet.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
    include: { document: true },
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">MCQ Practice Sets</h1>
        <p className="mt-2 text-gray-400">Practice your generated MCQ sets</p>
      </div>

      {mcqSets.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-zinc-900 p-8 text-center">
          <p className="text-gray-400">No MCQ sets yet.</p>
          <Link href="/dashboard/documents">
            <Button className="mt-4">Generate from documents</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {mcqSets.map((set) => (
            <div key={set.id} className="rounded-xl border border-white/10 bg-zinc-900 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{set.title}</h2>
                  <p className="mt-1 text-sm text-gray-400">
                    {set.questions.length} questions • {set.difficulty}
                  </p>
                  {set.document?.fileName && (
                    <p className="mt-2 text-sm text-gray-500">From {set.document.fileName}</p>
                  )}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Link href={`/dashboard/mcqs/${set.id}`}>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
                <Link href={`/dashboard/mcqs/${set.id}/practice`}>
                  <Button size="sm" className="bg-gradient-to-r from-pink-500 to-purple-600">
                    Practice
                  </Button>
                </Link>
                <McqDeleteButton
                  mcqSetId={set.id}
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
