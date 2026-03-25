import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NotesGrid } from "@/components/notes/notes-grid";
import { NotesFilters } from "@/components/notes/notes-filters";

export default async function NotesPage({
  searchParams,
}: {
  searchParams: { search?: string; format?: string; sort?: string };
}) {
  const session = await auth();

  const where: any = { userId: session!.user.id };

  if (searchParams.search) {
    where.OR = [
      { title: { contains: searchParams.search, mode: "insensitive" } },
      { content: { contains: searchParams.search, mode: "insensitive" } },
    ];
  }

  if (searchParams.format) {
    where.format = searchParams.format;
  }

  const orderBy: any = {};
  if (searchParams.sort === "oldest") {
    orderBy.createdAt = "asc";
  } else if (searchParams.sort === "title") {
    orderBy.title = "asc";
  } else if (searchParams.sort === "words") {
    orderBy.wordCount = "desc";
  } else {
    orderBy.createdAt = "desc";
  }

  const notes = await prisma.note.findMany({
    where,
    orderBy,
    include: {
      document: true,
    },
  });

  const totalWords = notes.reduce((sum, note) => sum + note.wordCount, 0);
  const stats = {
    total: notes.length,
    totalWords,
    avgWords: Math.round(totalWords / notes.length) || 0,
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Study Notes</h1>
          <p className="mt-2 text-gray-400">All your AI-generated notes in one place</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-zinc-900 p-6">
          <p className="text-sm text-gray-400">Total Notes</p>
          <p className="mt-2 text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-zinc-900 p-6">
          <p className="text-sm text-gray-400">Total Words</p>
          <p className="mt-2 text-3xl font-bold">{stats.totalWords.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-zinc-900 p-6">
          <p className="text-sm text-gray-400">Avg Words/Note</p>
          <p className="mt-2 text-3xl font-bold">{stats.avgWords.toLocaleString()}</p>
        </div>
      </div>

      <NotesFilters />

      <NotesGrid notes={notes} />
    </div>
  );
}
