import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export default async function AdminContentPage() {
  await requireAdmin();

  const [documents, notes, mcqSets, examPapers] = await prisma.$transaction([
    prisma.document.findMany({
      orderBy: { uploadedAt: "desc" },
      take: 10,
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
    prisma.note.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        user: { select: { id: true, name: true, email: true } },
        document: { select: { id: true, fileName: true } },
      },
    }),
    prisma.mcqSet.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        user: { select: { id: true, name: true, email: true } },
        document: { select: { id: true, fileName: true } },
      },
    }),
    prisma.examPaper.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Content Overview</h1>
        <p className="mt-2 text-gray-400">Review uploads and recently generated study materials across the platform.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
          <h2 className="text-xl font-semibold text-white">Recent Documents</h2>
          <div className="mt-4 space-y-3">
            {documents.map((document) => (
              <div key={document.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="font-medium text-white">{document.fileName}</p>
                <p className="mt-1 text-sm text-gray-400">
                  {document.user.name || document.user.email} • {document.subject || "General"}
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  Uploaded {new Date(document.uploadedAt).toLocaleString()}
                </p>
                <Link href={`/admin/users/${document.user.id}`} className="mt-3 inline-block text-sm text-pink-400 hover:text-pink-300">
                  View owner
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
          <h2 className="text-xl font-semibold text-white">Recent Notes</h2>
          <div className="mt-4 space-y-3">
            {notes.map((note) => (
              <div key={note.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="font-medium text-white">{note.title}</p>
                <p className="mt-1 text-sm text-gray-400">
                  {note.user.name || note.user.email} • {note.wordCount} words
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  Source: {note.document.fileName} • {new Date(note.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
          <h2 className="text-xl font-semibold text-white">Recent MCQ Sets</h2>
          <div className="mt-4 space-y-3">
            {mcqSets.map((mcqSet) => (
              <div key={mcqSet.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="font-medium text-white">{mcqSet.title}</p>
                <p className="mt-1 text-sm text-gray-400">
                  {mcqSet.user.name || mcqSet.user.email} • {mcqSet.difficulty}
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  Source: {mcqSet.document.fileName} • {new Date(mcqSet.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
          <h2 className="text-xl font-semibold text-white">Recent Exam Papers</h2>
          <div className="mt-4 space-y-3">
            {examPapers.map((paper) => (
              <div key={paper.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="font-medium text-white">{paper.title}</p>
                <p className="mt-1 text-sm text-gray-400">
                  {paper.user.name || paper.user.email} • {paper.university}
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  {paper.totalMarks} marks • {new Date(paper.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
