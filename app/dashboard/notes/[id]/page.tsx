import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { NoteViewer } from "@/components/notes/note-viewer";

export default async function NotePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  const note = await prisma.note.findFirst({
    where: {
      id: params.id,
      userId: session!.user.id,
    },
    include: {
      document: true,
    },
  });

  if (!note) {
    notFound();
  }

  return <NoteViewer note={note} />;
}
