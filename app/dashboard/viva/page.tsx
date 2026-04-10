import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VivaSetsList } from "@/components/viva/viva-sets-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";
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

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Viva Questions</h1>
          <p className="mt-2 text-gray-400">
            Practice oral examination questions with model answers
          </p>
        </div>
        <Link href="/dashboard/documents">
          <Button className="bg-gradient-to-r from-pink-500 to-purple-600">
            <Plus className="mr-2 h-4 w-4" />
            Generate from Document
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-zinc-900 p-6">
          <p className="text-sm text-gray-400">Total Sets</p>
          <p className="mt-2 text-2xl font-bold sm:text-3xl">{vivaDocuments.length}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-zinc-900 p-6">
          <p className="text-sm text-gray-400">Questions Ready</p>
          <p className="mt-2 text-2xl font-bold sm:text-3xl">
            {vivaDocuments.reduce((sum, doc: any) => sum + (doc.vivaQuestions?.length || 0), 0)}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-zinc-900 p-6">
          <p className="text-sm text-gray-400">Practice Sessions</p>
          <p className="mt-2 text-2xl font-bold sm:text-3xl">0</p>
        </div>
      </div>

      {vivaDocuments.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No viva sets yet"
          description="Generate viva questions from any uploaded document to build oral-exam practice with model answers."
          actionLabel="Generate from Document"
          actionHref="/dashboard/documents"
        />
      ) : (
        <VivaSetsList documents={vivaDocuments} />
      )}
    </div>
  );
}
