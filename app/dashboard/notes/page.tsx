import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NotesGrid } from "@/components/notes/notes-grid";
import { NotesFilters } from "@/components/notes/notes-filters";
import { BookOpen, Clock3, FileText, Sparkles } from "lucide-react";

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
  const totalDocuments = new Set(notes.map((note) => note.documentId).filter(Boolean)).size;
  const recentNote = notes[0];
  const stats = {
    total: notes.length,
    totalWords,
    avgWords: Math.round(totalWords / notes.length) || 0,
    totalDocuments,
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.16),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015)),rgba(9,9,11,0.92)] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.28)] sm:rounded-[30px] sm:p-8">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),transparent_48%)]" />
        <div className="relative grid gap-5 sm:gap-6 lg:grid-cols-[1.35fr_0.85fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs text-cyan-100 sm:px-4 sm:text-sm">
              <BookOpen className="h-4 w-4" />
              Notes Library
            </div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:mt-5 sm:text-4xl">
              Turn every upload into a cleaner revision shelf
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-300 sm:leading-7 sm:text-base">
              Browse, search, and revisit all your AI-generated notes in one place. This page now feels more like a focused study library and less like a raw list.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3.5 backdrop-blur-sm sm:p-4">
              <div className="flex items-center gap-2 text-cyan-100">
                <Clock3 className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.22em] text-cyan-100/80">Latest Note</span>
              </div>
              <p className="mt-3 line-clamp-2 text-sm font-semibold text-white sm:text-base">
                {recentNote ? recentNote.title : "Your next note will appear here"}
              </p>
              <p className="mt-1 text-sm text-gray-400">
                {recentNote
                  ? `${recentNote.wordCount.toLocaleString()} words ready for review`
                  : "Generate notes from any document to start your library."}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3.5 backdrop-blur-sm sm:p-4">
              <div className="flex items-center gap-2 text-blue-100">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.22em] text-blue-100/80">Coverage</span>
              </div>
              <p className="mt-3 text-sm font-semibold text-white sm:text-base">
                {stats.totalDocuments} source document{stats.totalDocuments === 1 ? "" : "s"}
              </p>
              <p className="mt-1 text-sm text-gray-400">
                Notes connected to your uploaded study material.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
        <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01)),rgba(24,24,27,0.92)] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-500/10 p-2.5 sm:p-3">
              <FileText className="h-5 w-5 text-cyan-300" />
            </div>
            <p className="text-sm text-gray-400">Total Notes</p>
          </div>
          <p className="mt-3 text-2xl font-bold text-white sm:mt-4 sm:text-3xl">{stats.total}</p>
        </div>
        <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01)),rgba(24,24,27,0.92)] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-500/10 p-2.5 sm:p-3">
              <BookOpen className="h-5 w-5 text-blue-300" />
            </div>
            <p className="text-sm text-gray-400">Total Words</p>
          </div>
          <p className="mt-3 text-2xl font-bold text-white sm:mt-4 sm:text-3xl">{stats.totalWords.toLocaleString()}</p>
        </div>
        <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01)),rgba(24,24,27,0.92)] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:p-6 sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-500/10 p-2.5 sm:p-3">
              <Clock3 className="h-5 w-5 text-sky-300" />
            </div>
            <p className="text-sm text-gray-400">Avg Words/Note</p>
          </div>
          <p className="mt-3 text-2xl font-bold text-white sm:mt-4 sm:text-3xl">{stats.avgWords.toLocaleString()}</p>
        </div>
      </div>

      <NotesFilters />

      <NotesGrid notes={notes} />
    </div>
  );
}
