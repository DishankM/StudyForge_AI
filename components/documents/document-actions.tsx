"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, HelpCircle, Sparkles, Loader2, Trash2, CheckCircle2, Layers3 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { GenerationProgress } from "@/components/generation/generation-progress";
import { cn } from "@/lib/utils";

type GenerationMode = "fast" | "full";
type GenerationAction = "notes" | "mcqs" | "viva" | null;
type RecommendedAction = "notes" | "mcqs" | "viva" | "revision-pack" | null;

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

const RECOMMENDATION_COPY: Record<Exclude<RecommendedAction, null>, { title: string; description: string }> = {
  notes: {
    title: "Recommended next step: Generate notes",
    description: "Start with notes to get a quick, structured summary before moving into practice.",
  },
  mcqs: {
    title: "Recommended next step: Generate MCQs",
    description: "You chose practice-first, so MCQs are the fastest way to start active recall from this file.",
  },
  viva: {
    title: "Recommended next step: Generate viva questions",
    description: "Build oral-exam prompts and model answers first, then branch into notes or MCQs if needed.",
  },
  "revision-pack": {
    title: "Recommended next step: Build your revision pack",
    description: "Best flow for this upload: generate notes first, then MCQs, then viva questions from the same document.",
  },
};

export function DocumentActions({
  documentId,
  recommendedAction = null,
}: {
  documentId: string;
  recommendedAction?: RecommendedAction;
}) {
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
  const highlightClasses = {
    notes: recommendedAction === "notes" || recommendedAction === "revision-pack",
    mcqs: recommendedAction === "mcqs",
    viva: recommendedAction === "viva" || recommendedAction === "revision-pack",
  };

  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900 p-5 sm:p-6">
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold sm:text-xl">Generate Content</h2>
          <p className="mt-1 text-sm text-gray-400">
            Pick a generation mode, then create notes, MCQs, or viva questions.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-2 rounded-xl border border-white/10 bg-zinc-800/60 p-1 sm:grid-cols-2">
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

      {recommendedAction && (
        <div className="mb-4 rounded-2xl border border-pink-500/20 bg-pink-500/10 p-4">
          <div className="flex items-start gap-3">
            {recommendedAction === "revision-pack" ? (
              <Layers3 className="mt-0.5 h-5 w-5 shrink-0 text-pink-200" />
            ) : (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-pink-200" />
            )}
            <div>
              <p className="font-semibold text-white">{RECOMMENDATION_COPY[recommendedAction].title}</p>
              <p className="mt-1 text-sm text-pink-100/80">
                {RECOMMENDATION_COPY[recommendedAction].description}
              </p>
            </div>
          </div>
        </div>
      )}

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
          className={cn(
            "h-auto flex-col gap-2 border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 py-5 hover:from-blue-500/20 hover:to-cyan-500/20 sm:py-6",
            highlightClasses.notes && "ring-2 ring-blue-400/70 ring-offset-2 ring-offset-zinc-900"
          )}
        >
          {loadingAction === "notes" ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <FileText className="h-8 w-8 text-blue-400" />
          )}
          <span className="font-semibold">Generate Notes</span>
          <span className="text-xs text-gray-400">
            {recommendedAction === "revision-pack" ? "Step 1 of your revision pack" : "Study-ready summaries"}
          </span>
        </Button>

        <Button
          onClick={generateMCQs}
          disabled={loadingAction !== null}
          className={cn(
            "h-auto flex-col gap-2 border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 py-5 hover:from-purple-500/20 hover:to-pink-500/20 sm:py-6",
            highlightClasses.mcqs && "ring-2 ring-purple-400/70 ring-offset-2 ring-offset-zinc-900"
          )}
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
          className={cn(
            "h-auto flex-col gap-2 border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-red-500/10 py-5 hover:from-orange-500/20 hover:to-red-500/20 sm:py-6",
            highlightClasses.viva && "ring-2 ring-orange-400/70 ring-offset-2 ring-offset-zinc-900"
          )}
        >
          {loadingAction === "viva" ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <Sparkles className="h-8 w-8 text-orange-400" />
          )}
          <span className="font-semibold">Viva Questions</span>
          <span className="text-xs text-gray-400">
            {recommendedAction === "revision-pack" ? "Step 3 of your revision pack" : "Oral exam prep"}
          </span>
        </Button>
      </div>

      <div className="mt-6 flex flex-col gap-4 rounded-lg border border-red-500/20 bg-red-500/5 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-red-400">Delete document</p>
          <p className="text-xs text-red-300/80">Removes the file and all generated content.</p>
        </div>
        <Button
          onClick={deleteDocument}
          disabled={loadingAction !== null}
          className="w-full border border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20 sm:w-auto"
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
