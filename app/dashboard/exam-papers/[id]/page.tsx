import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ExamPaperViewer } from "@/components/exam-papers/exam-paper-viewer";

export default async function ExamPaperPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  const examPaper = await prisma.examPaper.findFirst({
    where: {
      id: params.id,
      userId: session!.user.id,
    },
  });

  if (!examPaper) {
    notFound();
  }

  return <ExamPaperViewer examPaper={examPaper} />;
}
