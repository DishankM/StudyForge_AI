import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DocumentsList } from "@/components/documents/documents-list";

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const session = await auth();

  const where: any = { userId: session!.user.id };

  if (searchParams.search) {
    where.OR = [
      { fileName: { contains: searchParams.search, mode: "insensitive" } },
      { subject: { contains: searchParams.search, mode: "insensitive" } },
      { documentType: { contains: searchParams.search, mode: "insensitive" } },
    ];
  }

  const documents = await prisma.document.findMany({
    where,
    orderBy: { uploadedAt: "desc" },
    include: {
      notes: true,
      mcqSets: true,
    },
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">My Documents</h1>
          <p className="mt-2 text-gray-400">Manage all your uploaded files and generated content</p>
        </div>
      </div>

      <DocumentsList documents={documents} />
    </div>
  );
}
