import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Viva Practice</h1>
          <p className="mt-2 text-gray-400">
            {questions.length} questions • {document.fileName}
          </p>
        </div>
        <Link href="/dashboard/viva">
          <Button variant="outline">Back to Viva</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {questions.map((item: any, index: number) => (
          <div
            key={item.id || `${document.id}-${index}`}
            className="rounded-xl border border-white/10 bg-zinc-900 p-6"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Q{index + 1}</h2>
              <span className="rounded bg-white/5 px-2 py-1 text-xs text-gray-400">
                {item.difficulty || "general"}
              </span>
            </div>
            <p className="text-gray-200">{item.question}</p>
            {item.answer && (
              <div className="mt-4 rounded-lg border border-white/10 bg-zinc-800/60 p-4">
                <p className="text-xs uppercase text-gray-500">Model answer</p>
                <p className="mt-2 text-sm text-gray-300">{item.answer}</p>
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
