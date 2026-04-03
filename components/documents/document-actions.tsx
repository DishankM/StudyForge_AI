"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, HelpCircle, Sparkles, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { GenerationProgress } from "@/components/generation/generation-progress";
import { cn } from "@/lib/utils";

type GenerationMode = "fast" | "full";
type GenerationAction = "notes" | "mcqs" | "viva" | null;

const MODE_COPY: Record<GenerationMode, { title: string; description: string }> = {
  fast: {
    title: "Fast Mode",
    description: "Uses the first few chunks for quicker results and lower wait time.",
  },
  full: {
    title: "Full Mode",
    description: "Processes the full document for stronger coverage and better completeness.",
  },
};

const STAGE_MAP: Record<Exclude<GenerationAction, null>, Record<GenerationMode, string[]>> = {
  notes: {
    fast: ["Extracting text", "Summarizing first chunks", "Polishing final notes", "Saving notes"],
    full: ["Extracting text", "Processing all chunks", "Merging summaries", "Saving notes"],
  },
  mcqs: {
    fast: ["Extracting text", "Generating question pool", "Selecting best questions", "Saving set"],
    full: ["Extracting text", "Generating across all chunks", "Deduplicating questions", "Saving set"],
  },
  viva: {
    fast: ["Extracting text", "Generating viva pool", "Selecting best questions", "Saving set"],
    full: ["Extracting text", "Generating across all chunks", "Deduplicating questions", "Saving set"],
  },
};

const ACTION_COPY: Record<Exclude<GenerationAction, null>, { title: string; description: string }> = {
  notes: {
    title: "Generating notes",
    description: "Building study-ready notes from your document.",
  },
  mcqs: {
    title: "Generating MCQs",
    description: "Creating a practice set and trimming it to the best questions.",
  },
  viva: {
    title: "Generating viva questions",
    description: "Preparing oral-exam questions with model answers.",
  },
};

export function DocumentActions({ documentId }: { documentId: string }) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [mode, setMode] = useState<GenerationMode>("full");
  const [activeGeneration, setActiveGeneration] = useState<{
    action: Exclude<GenerationAction, null>;
    mode: GenerationMode;
    progress: number;
    stageIndex: number;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!activeGeneration) {
      return;
    }

    const stages = STAGE_MAP[activeGeneration.action][activeGeneration.mode];
    const maxProgress = 92;
    const interval = window.setInterval(() => {
      setActiveGeneration((current) => {
        if (!current) {
          return current;
        }

        const stageSize = maxProgress / stages.length;
        const nextProgress = Math.min(current.progress + (current.mode === "full" ? 4 : 7), maxProgress);
        const nextStageIndex = Math.min(
          stages.length - 1,
          Math.floor(nextProgress / stageSize)
        );

        return {
          ...current,
          progress: nextProgress,
          stageIndex: nextStageIndex,
        };
      });
    }, activeGeneration.mode === "full" ? 1400 : 900);

    return () => window.clearInterval(interval);
  }, [activeGeneration]);

  const progressDisplay = useMemo(() => {
    if (!activeGeneration) {
      return null;
    }

    const stages = STAGE_MAP[activeGeneration.action][activeGeneration.mode];
    return {
      title: ACTION_COPY[activeGeneration.action].title,
      description: ACTION_COPY[activeGeneration.action].description,
      stageLabel: stages[activeGeneration.stageIndex] || stages[0],
      progress: activeGeneration.progress,
    };
  }, [activeGeneration]);

  const startGeneration = (action: Exclude<GenerationAction, null>) => {
    setLoadingAction(action);
    setActiveGeneration({
      action,
      mode,
      progress: 8,
      stageIndex: 0,
    });
  };

  const finishGeneration = () => {
    setLoadingAction(null);
    setActiveGeneration(null);
  };

  const generateNotes = async () => {
    startGeneration("notes");
    try {
      const response = await fetch("/api/generate/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, mode }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate notes");
      }

      const data = await response.json();
      toast.success(
        `Notes generated successfully${data.chunkCount ? ` from ${data.chunkCount} chunk${data.chunkCount === 1 ? "" : "s"}` : ""}!`
      );
      router.refresh();
    } catch (error) {
      toast.error("Failed to generate notes");
    } finally {
      finishGeneration();
    }
  };

  const generateMCQs = async () => {
    startGeneration("mcqs");
    try {
      const response = await fetch("/api/generate/mcqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, count: 20, mode }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate MCQs");
      }

      const data = await response.json();
      toast.success(
        `${data.questionCount} MCQs generated${data.chunkCount ? ` from ${data.chunkCount} chunk${data.chunkCount === 1 ? "" : "s"}` : ""}!`
      );
      router.refresh();
    } catch (error) {
      toast.error("Failed to generate MCQs");
    } finally {
      finishGeneration();
    }
  };

  const generateViva = async () => {
    startGeneration("viva");
    try {
      const response = await fetch("/api/generate/viva", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, count: 25, mode }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate viva questions");
      }

      const data = await response.json();
      toast.success(
        `Viva questions generated${data.chunkCount ? ` from ${data.chunkCount} chunk${data.chunkCount === 1 ? "" : "s"}` : ""}!`
      );
      router.refresh();
    } catch (error) {
      toast.error("Failed to generate viva questions");
    } finally {
      finishGeneration();
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
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Generate Content</h2>
          <p className="mt-1 text-sm text-gray-400">
            Pick a generation mode, then create notes, MCQs, or viva questions.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-zinc-800/60 p-1">
          {(["fast", "full"] as GenerationMode[]).map((option) => (
            <button
              key={option}
              type="button"
              disabled={loadingAction !== null}
              onClick={() => setMode(option)}
              className={cn(
                "rounded-lg px-4 py-2 text-left transition",
                mode === option
                  ? "bg-white text-zinc-950"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <p className="text-sm font-semibold">{MODE_COPY[option].title}</p>
              <p className="mt-1 text-xs opacity-80">{MODE_COPY[option].description}</p>
            </button>
          ))}
        </div>
      </div>

      {progressDisplay && (
        <div className="mb-4">
          <GenerationProgress
            title={progressDisplay.title}
            description={progressDisplay.description}
            progress={progressDisplay.progress}
            stageLabel={progressDisplay.stageLabel}
          />
        </div>
      )}

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
