import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { ArrowUpRight, FileText, BrainCircuit, HelpCircle, GraduationCap } from "lucide-react";

function ContentSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof FileText;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-2.5">
          <Icon className="h-5 w-5 text-pink-300" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <p className="text-sm text-gray-400">Most recent records across the platform</p>
        </div>
      </div>
      <div className="mt-5 space-y-3">{children}</div>
    </section>
  );
}

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
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Content Overview</h1>
        <p className="mt-3 text-base leading-7 text-gray-400">Review uploads and recently generated study materials across the platform.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ContentSection title="Recent Documents" icon={FileText}>
          {documents.map((document) => (
            <div key={document.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/[0.07]">
              <p className="font-medium text-white">{document.fileName}</p>
              <p className="mt-1 text-sm text-gray-400">
                {document.user.name || document.user.email} • {document.subject || "General"}
              </p>
              <p className="mt-2 text-xs text-gray-500">Uploaded {new Date(document.uploadedAt).toLocaleString()}</p>
              <Link href={`/admin/users/${document.user.id}`} className="mt-3 inline-flex items-center gap-1 text-sm text-pink-400 hover:text-pink-300">
                View owner
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </ContentSection>

        <ContentSection title="Recent Notes" icon={BrainCircuit}>
          {notes.map((note) => (
            <div key={note.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/[0.07]">
              <p className="font-medium text-white">{note.title}</p>
              <p className="mt-1 text-sm text-gray-400">{note.user.name || note.user.email} • {note.wordCount} words</p>
              <p className="mt-2 text-xs text-gray-500">
                Source: {note.document.fileName} • {new Date(note.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </ContentSection>

        <ContentSection title="Recent MCQ Sets" icon={HelpCircle}>
          {mcqSets.map((mcqSet) => (
            <div key={mcqSet.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/[0.07]">
              <p className="font-medium text-white">{mcqSet.title}</p>
              <p className="mt-1 text-sm text-gray-400">{mcqSet.user.name || mcqSet.user.email} • {mcqSet.difficulty}</p>
              <p className="mt-2 text-xs text-gray-500">
                Source: {mcqSet.document.fileName} • {new Date(mcqSet.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </ContentSection>

        <ContentSection title="Recent Exam Papers" icon={GraduationCap}>
          {examPapers.map((paper) => (
            <div key={paper.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/[0.07]">
              <p className="font-medium text-white">{paper.title}</p>
              <p className="mt-1 text-sm text-gray-400">{paper.user.name || paper.user.email} • {paper.university}</p>
              <p className="mt-2 text-xs text-gray-500">{paper.totalMarks} marks • {new Date(paper.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </ContentSection>
      </div>
    </div>
  );
}
