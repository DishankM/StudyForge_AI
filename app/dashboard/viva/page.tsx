import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VivaSetsList } from "@/components/viva/viva-sets-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

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
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Viva Questions</h1>
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
          <p className="mt-2 text-3xl font-bold">{vivaDocuments.length}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-zinc-900 p-6">
          <p className="text-sm text-gray-400">Questions Ready</p>
          <p className="mt-2 text-3xl font-bold">
            {vivaDocuments.reduce((sum, doc: any) => sum + (doc.vivaQuestions?.length || 0), 0)}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-zinc-900 p-6">
          <p className="text-sm text-gray-400">Practice Sessions</p>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
      </div>

      <VivaSetsList documents={vivaDocuments} />
    </div>
  );
}
