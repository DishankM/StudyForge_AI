import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { DocumentActions } from "@/components/documents/document-actions";
import { DocumentInfo } from "@/components/documents/document-info";
import { GeneratedContent } from "@/components/documents/generated-content";
import { FileText, Sparkles } from "lucide-react";

export default async function DocumentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  const document = await prisma.document.findFirst({
    where: {
      id: params.id,
      userId: session!.user.id,
    },
    include: {
      notes: true,
      mcqSets: true,
    },
  });

  if (!document) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950/80 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.18),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.14),_transparent_32%)]" />
        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-300">
              <FileText className="h-4 w-4 text-pink-300" />
              Source document
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-white md:text-4xl">{document.fileName}</h1>
            <p className="mt-3 text-base text-gray-300">
              Uploaded {new Date(document.uploadedAt).toLocaleDateString()} and ready for generation, practice, and review.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-gray-400">Generated Outputs</p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {document.notes.length + document.mcqSets.length + (Array.isArray(document.vivaQuestions) ? 1 : 0)}
              </p>
              <p className="mt-1 text-sm text-gray-400">Assets already created from this file</p>
            </div>
            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-orange-200">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.24em]">Ready to Generate</span>
              </div>
              <p className="mt-2 text-sm text-orange-100/90">
                Use Fast mode for quick drafts or Full mode for deeper document coverage.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <DocumentInfo document={document} />
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div id="document-actions">
            <DocumentActions documentId={document.id} />
          </div>
          <GeneratedContent document={document} />
        </div>
      </div>
    </div>
  );
}
