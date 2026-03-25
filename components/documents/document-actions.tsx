"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, HelpCircle, Sparkles, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DocumentActions({ documentId }: { documentId: string }) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const router = useRouter();

  const generateNotes = async () => {
    setLoadingAction("notes");
    try {
      const response = await fetch("/api/generate/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate notes");
      }

      await response.json();
      toast.success("Notes generated successfully!");
      router.refresh();
    } catch (error) {
      toast.error("Failed to generate notes");
    } finally {
      setLoadingAction(null);
    }
  };

  const generateMCQs = async () => {
    setLoadingAction("mcqs");
    try {
      const response = await fetch("/api/generate/mcqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, count: 20 }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate MCQs");
      }

      const data = await response.json();
      toast.success(`${data.questionCount} MCQs generated!`);
      router.refresh();
    } catch (error) {
      toast.error("Failed to generate MCQs");
    } finally {
      setLoadingAction(null);
    }
  };

  const generateViva = async () => {
    setLoadingAction("viva");
    try {
      const response = await fetch("/api/generate/viva", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, count: 25 }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate viva questions");
      }

      await response.json();
      toast.success("Viva questions generated!");
      router.refresh();
    } catch (error) {
      toast.error("Failed to generate viva questions");
    } finally {
      setLoadingAction(null);
    }
  };

  const deleteDocument = async () => {
    if (!confirm("Are you sure you want to delete this document? This cannot be undone.")) {
      return;
    }

    setLoadingAction("delete");
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete document");
      }

      toast.success("Document deleted");
      router.push("/dashboard/documents");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete document");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900 p-6">
      <h2 className="mb-4 text-xl font-semibold">Generate Content</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Button
          onClick={generateNotes}
          disabled={loadingAction !== null}
          className="h-auto flex-col gap-2 border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 py-6 hover:from-blue-500/20 hover:to-cyan-500/20"
        >
          {loadingAction === "notes" ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <FileText className="h-8 w-8 text-blue-400" />
          )}
          <span className="font-semibold">Generate Notes</span>
          <span className="text-xs text-gray-400">Study-ready summaries</span>
        </Button>

        <Button
          onClick={generateMCQs}
          disabled={loadingAction !== null}
          className="h-auto flex-col gap-2 border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 py-6 hover:from-purple-500/20 hover:to-pink-500/20"
        >
          {loadingAction === "mcqs" ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <HelpCircle className="h-8 w-8 text-purple-400" />
          )}
          <span className="font-semibold">Generate MCQs</span>
          <span className="text-xs text-gray-400">Practice questions</span>
        </Button>

        <Button
          onClick={generateViva}
          disabled={loadingAction !== null}
          className="h-auto flex-col gap-2 border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-red-500/10 py-6 hover:from-orange-500/20 hover:to-red-500/20"
        >
          {loadingAction === "viva" ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <Sparkles className="h-8 w-8 text-orange-400" />
          )}
          <span className="font-semibold">Viva Questions</span>
          <span className="text-xs text-gray-400">Oral exam prep</span>
        </Button>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/5 p-4">
        <div>
          <p className="font-semibold text-red-400">Delete document</p>
          <p className="text-xs text-red-300/80">Removes the file and all generated content.</p>
        </div>
        <Button
          onClick={deleteDocument}
          disabled={loadingAction !== null}
          className="border border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20"
        >
          {loadingAction === "delete" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="mr-2 h-4 w-4" />
          )}
          Delete
        </Button>
      </div>
    </div>
  );
}
