"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, HelpCircle, Sparkles, Loader2, Trash2, CheckCircle2, Layers3, ShieldCheck, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { GenerationProgress } from "@/components/generation/generation-progress";
import { cn } from "@/lib/utils";
import {
  estimateDocumentSections,
  getCoverageSummary,
  getDocumentTrustSignals,
  getGenerationTimeEstimate,
  type TrustDocumentLike,
} from "@/lib/ai-trust";

type GenerationMode = "fast" | "full";
type GenerationAction = "notes" | "mcqs" | "viva" | null;
type RecommendedAction = "notes" | "mcqs" | "viva" | "revision-pack" | null;

const MODE_COPY: Record<GenerationMode, { title: string; description: string }> = {
  fast: {
    title: "Fast",
    description: "Quicker, lighter coverage.",
  },
  full: {
    title: "Full",
    description: "Slower, stronger coverage.",
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
  document,
}: {
  documentId: string;
  recommendedAction?: RecommendedAction;
  document: TrustDocumentLike;
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
  const estimatedSections = useMemo(() => estimateDocumentSections(document), [document]);
  const trustSignals = useMemo(() => getDocumentTrustSignals(document), [document]);
  const coverageSummary = useMemo(() => getCoverageSummary(mode, estimatedSections), [mode, estimatedSections]);
  const notesEstimate = useMemo(() => getGenerationTimeEstimate("notes", mode, estimatedSections), [mode, estimatedSections]);
  const mcqEstimate = useMemo(() => getGenerationTimeEstimate("mcqs", mode, estimatedSections), [mode, estimatedSections]);
  const vivaEstimate = useMemo(() => getGenerationTimeEstimate("viva", mode, estimatedSections), [mode, estimatedSections]);
  const warningSignals = useMemo(() => trustSignals.filter((signal) => signal.tone === "warning"), [trustSignals]);

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
        `Notes generated in ${data.mode === "fast" ? "Fast" : "Full"} mode${data.chunkCount ? ` from ${data.chunkCount} source section${data.chunkCount === 1 ? "" : "s"}` : ""}.`
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
        `${data.questionCount} MCQs generated in ${data.mode === "fast" ? "Fast" : "Full"} mode${data.chunkCount ? ` from ${data.chunkCount} source section${data.chunkCount === 1 ? "" : "s"}` : ""}.`
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
        `Viva questions generated in ${data.mode === "fast" ? "Fast" : "Full"} mode${data.chunkCount ? ` from ${data.chunkCount} source section${data.chunkCount === 1 ? "" : "s"}` : ""}.`
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
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold sm:text-xl">Generate Content</h2>
          <p className="mt-1 text-sm text-gray-400">
            Choose a mode, then generate the study format you want.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-1.5 rounded-xl border border-white/10 bg-zinc-800/60 p-1">
          {(["fast", "full"] as GenerationMode[]).map((option) => (
            <button
              key={option}
              type="button"
              disabled={loadingAction !== null}
              onClick={() => setMode(option)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-left transition",
                mode === option
                  ? "bg-white text-zinc-950"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <p className="text-xs font-semibold sm:text-sm">{MODE_COPY[option].title}</p>
              <p className="mt-0.5 text-[10px] opacity-80 sm:text-[11px]">{MODE_COPY[option].description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
            <div>
              <p className="font-medium text-white">{coverageSummary.label}</p>
              <p className="mt-1 text-xs text-gray-400">{coverageSummary.detail}</p>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            {mode === "fast" ? "Best for quick drafts" : "Best for stronger completeness"}
          </div>
        </div>
        {warningSignals.length > 0 && (
          <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2">
            <div className="flex items-start gap-2">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
              <p className="text-xs text-amber-100/85">
                {warningSignals[0].detail}
              </p>
            </div>
          </div>
        )}
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

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        <Button
          onClick={generateNotes}
          disabled={loadingAction !== null}
          className={cn(
            "h-auto min-h-[152px] w-full flex-col items-start whitespace-normal rounded-2xl border border-blue-400/25 bg-[linear-gradient(145deg,rgba(59,130,246,0.2)_0%,rgba(6,182,212,0.12)_55%,rgba(8,47,73,0.2)_100%)] px-4 py-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_24px_rgba(2,6,23,0.3)] hover:-translate-y-0.5 hover:border-blue-300/40 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_18px_34px_rgba(14,116,144,0.28)]",
            highlightClasses.notes && "ring-2 ring-blue-400/70 ring-offset-2 ring-offset-zinc-900"
          )}
        >
          <div className="flex w-full items-start justify-between gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-300/20 bg-blue-500/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
              {loadingAction === "notes" ? (
                <Loader2 className="h-5 w-5 animate-spin text-blue-300" />
              ) : (
                <FileText className="h-5 w-5 text-blue-200" />
              )}
            </div>
            <span className="rounded-full border border-blue-300/30 bg-blue-500/20 px-2 py-0.5 text-[10px] font-medium text-blue-100">
              Est. {notesEstimate}
            </span>
          </div>
          <div className="mt-3 space-y-1">
            <span className="block text-sm font-semibold tracking-tight text-white sm:text-base">Generate Notes</span>
            <span className="block text-xs leading-5 text-blue-100/85 sm:text-sm sm:leading-5">
              {recommendedAction === "revision-pack" ? "Step 1 of your revision pack" : "Study-ready summaries"}
            </span>
          </div>
        </Button>

        <Button
          onClick={generateMCQs}
          disabled={loadingAction !== null}
          className={cn(
            "h-auto min-h-[152px] w-full flex-col items-start whitespace-normal rounded-2xl border border-purple-400/25 bg-[linear-gradient(145deg,rgba(147,51,234,0.2)_0%,rgba(236,72,153,0.12)_55%,rgba(74,4,78,0.22)_100%)] px-4 py-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_24px_rgba(24,24,27,0.35)] hover:-translate-y-0.5 hover:border-purple-300/40 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_18px_34px_rgba(126,34,206,0.28)]",
            highlightClasses.mcqs && "ring-2 ring-purple-400/70 ring-offset-2 ring-offset-zinc-900"
          )}
        >
          <div className="flex w-full items-start justify-between gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-300/20 bg-purple-500/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
              {loadingAction === "mcqs" ? (
                <Loader2 className="h-5 w-5 animate-spin text-purple-300" />
              ) : (
                <HelpCircle className="h-5 w-5 text-purple-200" />
              )}
            </div>
            <span className="rounded-full border border-purple-300/30 bg-purple-500/20 px-2 py-0.5 text-[10px] font-medium text-purple-100">
              Est. {mcqEstimate}
            </span>
          </div>
          <div className="mt-3 space-y-1">
            <span className="block text-sm font-semibold tracking-tight text-white sm:text-base">Generate MCQs</span>
            <span className="block text-xs leading-5 text-purple-100/85 sm:text-sm sm:leading-5">Practice questions</span>
          </div>
        </Button>

        <Button
          onClick={generateViva}
          disabled={loadingAction !== null}
          className={cn(
            "h-auto min-h-[152px] w-full flex-col items-start whitespace-normal rounded-2xl border border-orange-400/25 bg-[linear-gradient(145deg,rgba(249,115,22,0.2)_0%,rgba(239,68,68,0.12)_55%,rgba(124,45,18,0.24)_100%)] px-4 py-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_24px_rgba(24,24,27,0.35)] hover:-translate-y-0.5 hover:border-orange-300/40 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_18px_34px_rgba(194,65,12,0.3)]",
            highlightClasses.viva && "ring-2 ring-orange-400/70 ring-offset-2 ring-offset-zinc-900"
          )}
        >
          <div className="flex w-full items-start justify-between gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-300/20 bg-orange-500/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
              {loadingAction === "viva" ? (
                <Loader2 className="h-5 w-5 animate-spin text-orange-300" />
              ) : (
                <Sparkles className="h-5 w-5 text-orange-200" />
              )}
            </div>
            <span className="rounded-full border border-orange-300/30 bg-orange-500/20 px-2 py-0.5 text-[10px] font-medium text-orange-100">
              Est. {vivaEstimate}
            </span>
          </div>
          <div className="mt-3 space-y-1">
            <span className="block text-sm font-semibold tracking-tight text-white sm:text-base">Viva Questions</span>
            <span className="block text-xs leading-5 text-orange-100/85 sm:text-sm sm:leading-5">
              {recommendedAction === "revision-pack" ? "Step 3 of your revision pack" : "Oral exam prep"}
            </span>
          </div>
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
