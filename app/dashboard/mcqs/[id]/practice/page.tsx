import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MCQPracticeInterface } from "@/components/mcqs/practice-interface";

export default async function MCQPracticePage({
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

  return <MCQPracticeInterface mcqSet={mcqSet} />;
}
