import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DocumentsList } from "@/components/documents/documents-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: { search?: string; type?: string; generated?: string };
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

  if (searchParams.type) {
    where.documentType = { equals: searchParams.type, mode: "insensitive" };
  }

  if (searchParams.generated === "notes") {
    where.notes = { some: {} };
  } else if (searchParams.generated === "mcqs") {
    where.mcqSets = { some: {} };
  } else if (searchParams.generated === "none") {
    where.notes = { none: {} };
    where.mcqSets = { none: {} };
  }

  const documents = await prisma.document.findMany({
    where,
    orderBy: { uploadedAt: "desc" },
    include: {
      notes: true,
      mcqSets: true,
    },
  });

  const hasSearch = Boolean(searchParams.search?.trim());
  const activeType = searchParams.type ?? "all";
  const activeGenerated = searchParams.generated ?? "all";

  const getFilterHref = (updates: { type?: string; generated?: string }) => {
    const params = new URLSearchParams();
    if (searchParams.search) params.set("search", searchParams.search);

    const typeValue = updates.type ?? activeType;
    const generatedValue = updates.generated ?? activeGenerated;

    if (typeValue !== "all") params.set("type", typeValue);
    if (generatedValue !== "all") params.set("generated", generatedValue);

    const query = params.toString();
    return query ? `/dashboard/documents?${query}` : "/dashboard/documents";
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">My Documents</h1>
          <p className="mt-2 text-gray-400">
            Manage your uploads and open each document to generate notes and MCQs.
          </p>
        </div>
        <Button asChild className="w-full bg-gradient-to-r from-pink-500 to-purple-600 sm:w-auto">
          <Link href="/dashboard/upload">Upload new document</Link>
        </Button>
      </div>

      {hasSearch && (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-gray-300">
          Showing {documents.length} result{documents.length === 1 ? "" : "s"} for &quot;{searchParams.search}&quot;
        </div>
      )}

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-gray-300">Quick filters for faster desktop browsing</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={getFilterHref({ type: "all" })}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                activeType === "all"
                  ? "bg-pink-500/20 text-pink-100"
                  : "border border-white/10 bg-white/[0.03] text-gray-300 hover:text-white"
              }`}
            >
              All types
            </Link>
            <Link
              href={getFilterHref({ type: "Lecture Notes" })}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                activeType === "Lecture Notes"
                  ? "bg-pink-500/20 text-pink-100"
                  : "border border-white/10 bg-white/[0.03] text-gray-300 hover:text-white"
              }`}
            >
              Lecture Notes
            </Link>
            <Link
              href={getFilterHref({ type: "Past Paper" })}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                activeType === "Past Paper"
                  ? "bg-pink-500/20 text-pink-100"
                  : "border border-white/10 bg-white/[0.03] text-gray-300 hover:text-white"
              }`}
            >
              Past Paper
            </Link>
            <Link
              href={getFilterHref({ type: "Syllabus" })}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                activeType === "Syllabus"
                  ? "bg-pink-500/20 text-pink-100"
                  : "border border-white/10 bg-white/[0.03] text-gray-300 hover:text-white"
              }`}
            >
              Syllabus
            </Link>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href={getFilterHref({ generated: "all" })}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              activeGenerated === "all"
                ? "bg-purple-500/20 text-purple-100"
                : "border border-white/10 bg-white/[0.03] text-gray-300 hover:text-white"
            }`}
          >
            All generation states
          </Link>
          <Link
            href={getFilterHref({ generated: "notes" })}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              activeGenerated === "notes"
                ? "bg-purple-500/20 text-purple-100"
                : "border border-white/10 bg-white/[0.03] text-gray-300 hover:text-white"
            }`}
          >
            Has notes
          </Link>
          <Link
            href={getFilterHref({ generated: "mcqs" })}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              activeGenerated === "mcqs"
                ? "bg-purple-500/20 text-purple-100"
                : "border border-white/10 bg-white/[0.03] text-gray-300 hover:text-white"
            }`}
          >
            Has MCQs
          </Link>
          <Link
            href={getFilterHref({ generated: "none" })}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              activeGenerated === "none"
                ? "bg-purple-500/20 text-purple-100"
                : "border border-white/10 bg-white/[0.03] text-gray-300 hover:text-white"
            }`}
          >
            No generated content yet
          </Link>
        </div>
      </div>

      <DocumentsList documents={documents} />
    </div>
  );
}
