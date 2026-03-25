import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { DocumentActions } from "@/components/documents/document-actions";
import { DocumentInfo } from "@/components/documents/document-info";
import { GeneratedContent } from "@/components/documents/generated-content";

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
      <div>
        <h1 className="text-3xl font-bold">{document.fileName}</h1>
        <p className="mt-2 text-gray-400">
          Uploaded {new Date(document.uploadedAt).toLocaleDateString()}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <DocumentInfo document={document} />
        </div>

        <div className="space-y-6 lg:col-span-2">
          <DocumentActions documentId={document.id} />
          <GeneratedContent document={document} />
        </div>
      </div>
    </div>
  );
}
