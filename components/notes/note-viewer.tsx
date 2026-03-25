"use client";

import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

export function NoteViewer({ note }: { note: any }) {
  const downloadAsText = () => {
    const element = document.createElement("a");
    const file = new Blob([note.content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${note.title}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{note.title}</h1>
          <p className="mt-2 text-sm text-gray-400">
            {note.wordCount} words - {note.format}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={downloadAsText}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={shareNote}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-zinc-900 p-6">
        <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300">
          <ReactMarkdown>{note.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
