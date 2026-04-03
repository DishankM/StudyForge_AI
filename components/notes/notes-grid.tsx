"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Trash2,
  ExternalLink,
  MoreVertical,
  Copy,
  Share2,
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
    const element = document.createElement("a");
    const file = new Blob([note.content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${note.title}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Note downloaded");
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
        description="Generate your first set of study notes from an uploaded document to start building your revision library."
        actionLabel="Upload Document"
        actionHref="/dashboard/upload"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <Card
          key={note.id}
          className="group border-white/10 bg-zinc-900 p-6 transition-all hover:border-pink-500/30"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold">{note.title}</h3>
                <p className="mt-1 text-xs text-gray-500">
                  {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 transition-opacity group-hover:opacity-100"
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

          <p className="mb-4 line-clamp-3 text-sm text-gray-400">
            {note.content.substring(0, 150)}...
          </p>

          <div className="mb-4 flex items-center justify-between text-xs text-gray-500">
            <span>{note.wordCount} words</span>
            <span className="rounded bg-zinc-800 px-2 py-1 capitalize">{note.format}</span>
          </div>

          {note.document && (
            <div className="mb-4 border-b border-white/10 pb-4 text-xs text-gray-500">
              From: {note.document.fileName}
            </div>
          )}

          <Link href={`/dashboard/notes/${note.id}`}>
            <Button variant="outline" className="w-full" size="sm">
              View Full Note
              <ExternalLink className="ml-2 h-3 w-3" />
            </Button>
          </Link>
        </Card>
      ))}
    </div>
  );
}
