"use client";

import { Button } from "@/components/ui/button";
import { Download, Share2, FileText, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { downloadStudyNotesPdf } from "@/lib/pdf-export";

export function NoteViewer({ note }: { note: any }) {
  const downloadAsPdf = () => {
    downloadStudyNotesPdf({
      filename: note.title,
      title: note.title,
      content: note.content,
      format: note.format,
      wordCount: note.wordCount,
    });
    toast.success("Note downloaded as PDF");
  };

  const shareNote = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: note.title,
          text: note.content,
        });
      } else {
        await navigator.clipboard.writeText(note.content);
        toast.success("Note copied to clipboard");
      }
    } catch (error) {
      toast.error("Unable to share note");
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950/80 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.18),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.14),_transparent_32%)]" />
        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-300">
              <FileText className="h-4 w-4 text-pink-300" />
              Generated note
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-white md:text-4xl">{note.title}</h1>
            <p className="mt-3 text-base text-gray-300">
              {note.wordCount} words in {note.format} format, ready to revise, export, or share.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-gray-400">Study density</p>
              <p className="mt-2 text-3xl font-semibold text-white">{note.wordCount}</p>
              <p className="mt-1 text-sm text-gray-400">Words of generated study material</p>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-emerald-200">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.24em]">Ready to use</span>
              </div>
              <p className="mt-2 text-sm text-emerald-100/90">
                Download this note for offline revision or share it instantly from the app.
              </p>
            </div>
          </div>
        </div>
        <div className="relative mt-6 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={downloadAsPdf}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" size="sm" onClick={shareNote}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <div className="rounded-[26px] border border-white/10 bg-zinc-950/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
        <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300">
          <ReactMarkdown>{note.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
