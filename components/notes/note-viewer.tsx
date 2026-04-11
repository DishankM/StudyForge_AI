"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Download, Edit3, FileText, Save, Share2, Sparkles, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { downloadStudyNotesPdf } from "@/lib/pdf-export";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function countWords(content: string) {
  const trimmed = content.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export function NoteViewer({ note }: { note: any }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const liveWordCount = useMemo(() => countWords(content), [content]);

  const downloadAsPdf = () => {
    downloadStudyNotesPdf({
      filename: title,
      title,
      content,
      format: note.format,
      wordCount: liveWordCount,
    });
    toast.success("Note downloaded as PDF");
  };

  const shareNote = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: content,
        });
      } else {
        await navigator.clipboard.writeText(content);
        toast.success("Note copied to clipboard");
      }
    } catch (error) {
      toast.error("Unable to share note");
    }
  };

  const startEditing = () => {
    setTitle(note.title);
    setContent(note.content);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setTitle(note.title);
    setContent(note.content);
    setIsEditing(false);
  };

  const saveChanges = async () => {
    const nextTitle = title.trim();
    const nextContent = content.trim();

    if (!nextTitle || !nextContent) {
      toast.error("Title and note content are required");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: nextTitle,
          content: nextContent,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update note");
      }

      note.title = nextTitle;
      note.content = nextContent;
      note.wordCount = countWords(nextContent);
      setTitle(nextTitle);
      setContent(nextContent);
      setIsEditing(false);
      toast.success("Note updated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update note");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950/80 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-6 lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.18),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.14),_transparent_32%)]" />
        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-300">
              <FileText className="h-4 w-4 text-pink-300" />
              {isEditing ? "Editing note" : "Generated note"}
            </div>
            {isEditing ? (
              <div className="mt-5">
                <Input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="h-12 text-lg font-semibold sm:text-xl"
                  placeholder="Note title"
                />
              </div>
            ) : (
              <h1 className="mt-5 break-words text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">{title}</h1>
            )}
            <p className="mt-3 text-base text-gray-300">
              {liveWordCount} words in {note.format} format, ready to revise, export, share, or edit.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-gray-400">Study density</p>
              <p className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{liveWordCount}</p>
              <p className="mt-1 text-sm text-gray-400">Words of generated study material</p>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-emerald-200">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.24em]">Flexible notes</span>
              </div>
              <p className="mt-2 text-sm text-emerald-100/90">
                Keep the AI draft, refine it yourself, and export the final version when it feels right.
              </p>
            </div>
          </div>
        </div>
        <div className="relative mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {isEditing ? (
            <>
              <Button onClick={saveChanges} disabled={isSaving} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 sm:w-auto">
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="outline" onClick={cancelEditing} disabled={isSaving} className="w-full sm:w-auto">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={downloadAsPdf} className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="outline" size="sm" onClick={shareNote} className="w-full sm:w-auto">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={startEditing} className="w-full sm:w-auto">
                <Edit3 className="mr-2 h-4 w-4" />
                Edit Note
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="rounded-[26px] border border-white/10 bg-zinc-950/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.24)] sm:p-6">
        {isEditing ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-white sm:text-xl">Edit Content</h2>
              <span className="text-sm text-gray-400">{liveWordCount} words</span>
            </div>
            <Textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="min-h-[420px] resize-y text-sm leading-7 sm:text-base"
              placeholder="Write or edit your note content here..."
            />
          </div>
        ) : (
          <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-p:leading-7 prose-li:leading-7 sm:prose-lg">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
