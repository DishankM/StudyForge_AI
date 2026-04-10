import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ExamPaperForm } from "@/components/exam-papers/exam-paper-form";

export default async function CreateExamPaperPage() {
  const session = await auth();
  const documents = await prisma.document.findMany({
    where: { userId: session!.user.id },
    orderBy: { uploadedAt: "desc" },
    select: {
      id: true,
      fileName: true,
      subject: true,
      documentType: true,
    },
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Create Exam Paper</h1>
        <p className="mt-2 text-gray-400">
          Generate university-style exam papers from a document or just a title
        </p>
      </div>

      <ExamPaperForm userId={session!.user.id} documents={documents} />
    </div>
  );
}
