import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ExamPapersPage() {
  const session = await auth();

  const examPapers = await prisma.examPaper.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exam Papers</h1>
          <p className="mt-2 text-gray-400">Create and manage your generated exam papers</p>
        </div>
        <Link href="/dashboard/exam-papers/create">
          <Button className="bg-gradient-to-r from-pink-500 to-purple-600">Create Exam Paper</Button>
        </Link>
      </div>

      {examPapers.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-zinc-900 p-8 text-center">
          <p className="text-gray-400">No exam papers yet.</p>
          <Link href="/dashboard/exam-papers/create">
            <Button className="mt-4">Create your first exam paper</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {examPapers.map((paper) => (
            <div key={paper.id} className="rounded-xl border border-white/10 bg-zinc-900 p-6">
              <h2 className="text-lg font-semibold">{paper.title}</h2>
              <p className="mt-1 text-sm text-gray-400">
                {paper.university} • {paper.duration} minutes • {paper.totalMarks} marks
              </p>
              <div className="mt-4">
                <Link href={`/dashboard/exam-papers/${paper.id}`}>
                  <Button variant="outline" size="sm">View</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
