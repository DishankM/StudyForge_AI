import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RoadmapCreateForm } from "@/components/revision/roadmap-create-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function NewRevisionRoadmapPage() {
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2 w-fit text-gray-400 hover:text-white">
            <Link href="/dashboard/revision">
              <ArrowLeft className="mr-2 h-4 w-4" />
              All roadmaps
            </Link>
          </Button>
          <h1 className="text-2xl font-bold sm:text-3xl">New exam roadmap</h1>
          <p className="mt-2 text-gray-400">
            We analyze your material and build a structured plan: important units, priority topics, phased goals, and daily tasks.
          </p>
        </div>
      </div>

      <RoadmapCreateForm userId={session!.user.id} documents={documents} />
    </div>
  );
}
