"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Trash2,
  MoreVertical,
  Copy,
  Share2,
  ArrowUpRight,
  BookOpen,
  Clock3,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/shared/empty-state";
import { downloadStudyNotesPdf } from "@/lib/pdf-export";

export function NotesGrid({ notes }: { notes: any[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (noteId: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    setDeletingId(noteId);
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      toast.success("Note deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete note");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = (note: any) => {
    downloadStudyNotesPdf({
      filename: note.title,
      title: note.title,
      content: note.content,
      format: note.format,
      wordCount: note.wordCount,
    });
    toast.success("Note downloaded as PDF");
  };

  const handleCopy = (note: any) => {
    navigator.clipboard.writeText(note.content);
    toast.success("Note copied to clipboard");
  };

  if (notes.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No notes yet"
        description="Generate your first set of study notes from an uploaded document so you can build a revision library that is easier to scan than raw files."
        examples={["Lecture slides for summary notes", "Textbook chapter for concise revision", "Syllabus topic for key-point notes"]}
        helperText="If you are in a hurry, start with concise notes. They work especially well for last-minute review before creating MCQs from the same document."
        actionLabel="Upload a document"
        actionHref="/dashboard/upload?action=notes"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
      {notes.map((note) => (
        <Card
          key={note.id}
          className="group overflow-hidden rounded-[22px] border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.012)),rgba(24,24,27,0.92)] p-0 shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 sm:rounded-[26px]"
        >
          <div className="border-b border-white/10 p-5 sm:p-6">
            <div className="mb-4 flex items-start justify-between gap-2 sm:gap-3">
              <div className="flex min-w-0 flex-1 items-start gap-2.5 sm:gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-cyan-950/40 sm:h-11 sm:w-11">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-cyan-100">
                      {note.format}
                    </span>
                  </div>
                  <h3 className="mt-3 line-clamp-2 text-base font-semibold text-white">{note.title}</h3>
                  <p className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                    <Clock3 className="h-3.5 w-3.5" />
                    {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-white/10 bg-zinc-900">
                  <DropdownMenuItem onClick={() => handleDownload(note)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleCopy(note)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(note.id)}
                    className="text-red-500"
                    disabled={deletingId === note.id}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <p className="line-clamp-4 text-sm leading-6 text-gray-300 sm:leading-7">
              {note.content.substring(0, 190)}...
            </p>
          </div>

          <div className="space-y-4 p-5 sm:space-y-5 sm:p-6">
            <div className="grid grid-cols-2 gap-2.5 text-sm sm:gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Length</p>
                <p className="mt-2 font-medium text-white">{note.wordCount.toLocaleString()} words</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Use Case</p>
                <p className="mt-2 font-medium capitalize text-white">{note.format}</p>
              </div>
            </div>

            {note.document && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 sm:p-4">
                <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-gray-500">Source document</p>
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-white/5 p-2">
                    <BookOpen className="h-4 w-4 text-cyan-300" />
                  </div>
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm leading-6 text-gray-300">{note.document.fileName}</p>
                  </div>
                </div>
              </div>
            )}

            <Link href={`/dashboard/notes/${note.id}`} className="block pt-1">
              <Button
                variant="outline"
                className="h-11 w-full border-white/10 bg-white/[0.02] text-white shadow-[0_10px_30px_rgba(0,0,0,0.12)] hover:border-cyan-400/30 hover:bg-cyan-400/10 sm:h-12"
                size="sm"
              >
                Open full note
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}
