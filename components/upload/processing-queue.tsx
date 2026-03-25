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
};

export function ProcessingQueue({ items }: { items: ProcessingItem[] }) {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900 p-6">
      <h2 className="mb-6 text-xl font-semibold">Processing Queue</h2>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border border-white/5 bg-zinc-800/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {(item.status === "uploading" || item.status === "processing") && (
                  <Loader2 className="h-5 w-5 animate-spin text-pink-500" />
                )}
                {item.status === "completed" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                {item.status === "failed" && <XCircle className="h-5 w-5 text-red-500" />}
                <div>
                  <p className="font-medium">{item.fileName}</p>
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
                    <Link href={`/dashboard/documents/${item.documentId}`}>
                      <Button size="sm" className="gap-2 bg-gradient-to-r from-pink-500 to-purple-600">
                        <FileText className="h-4 w-4" />
                        View Document
                      </Button>
                    </Link>
                    <Link href={`/dashboard/documents/${item.documentId}`}>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Sparkles className="h-4 w-4" />
                        Generate Content
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
