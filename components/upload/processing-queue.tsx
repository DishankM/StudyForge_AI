"use client";

import Link from "next/link";
import { CheckCircle2, Loader2, XCircle, FileText, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

type ProcessingItem = {
  id: string;
  fileName: string;
  status: "uploading" | "processing" | "completed" | "failed";
  progress: number;
  documentId?: string;
  message?: string;
  preferredOutcome: "notes" | "mcqs" | "viva" | "revision-pack";
};

const OUTCOME_CTA = {
  notes: {
    label: "Continue to Notes",
    href: (documentId: string) => `/dashboard/documents/${documentId}?action=notes`,
  },
  mcqs: {
    label: "Continue to MCQs",
    href: (documentId: string) => `/dashboard/documents/${documentId}?action=mcqs`,
  },
  viva: {
    label: "Continue to Viva",
    href: (documentId: string) => `/dashboard/documents/${documentId}?action=viva`,
  },
  "revision-pack": {
    label: "Open Revision Pack",
    href: (documentId: string) => `/dashboard/documents/${documentId}?action=revision-pack`,
  },
} as const;

export function ProcessingQueue({ items }: { items: ProcessingItem[] }) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-zinc-950/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Processing Queue</h2>
          <p className="mt-1 text-sm text-gray-400">Track each upload from transfer to ready-for-generation status.</p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-gray-400">
          {items.length} item{items.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {(item.status === "uploading" || item.status === "processing") && (
                  <Loader2 className="h-5 w-5 animate-spin text-pink-500" />
                )}
                {item.status === "completed" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                {item.status === "failed" && <XCircle className="h-5 w-5 text-red-500" />}
                <div>
                  <p className="font-medium text-white">{item.fileName}</p>
                  <p className="text-xs text-gray-500">
                    {item.message || item.status}
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-400">{item.progress}%</span>
            </div>

            <Progress value={item.progress} className="h-2" />

            {item.status === "completed" && (
              <div className="mt-4 flex flex-wrap gap-2">
                {item.documentId ? (
                  <>
                    <Link href={OUTCOME_CTA[item.preferredOutcome].href(item.documentId)}>
                      <Button size="sm" className="min-h-11 w-full gap-2 bg-gradient-to-r from-pink-500 to-purple-600 sm:w-auto">
                        <Sparkles className="h-4 w-4" />
                        {OUTCOME_CTA[item.preferredOutcome].label}
                      </Button>
                    </Link>
                    <Link href={`/dashboard/documents/${item.documentId}`}>
                      <Button size="sm" variant="outline" className="min-h-11 w-full gap-2 sm:w-auto">
                        <FileText className="h-4 w-4" />
                        View Document
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Button size="sm" variant="outline" disabled>
                    Document ready
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
