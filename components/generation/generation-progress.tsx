"use client";

import { Progress } from "@/components/ui/progress";

export function GenerationProgress({
  title,
  description,
  progress,
  stageLabel,
}: {
  title: string;
  description: string;
  progress: number;
  stageLabel: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900/80 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-white">{title}</p>
          <p className="mt-1 text-sm text-gray-400">{description}</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-300">
          {stageLabel}
        </span>
      </div>
      <Progress value={progress} className="mt-4 h-2" />
      <p className="mt-2 text-xs text-gray-500">
        Estimated progress for the current generation request.
      </p>
    </div>
  );
}
