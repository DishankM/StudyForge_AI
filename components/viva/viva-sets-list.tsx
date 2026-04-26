"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ExternalLink, Play, Sparkles } from "lucide-react";
import Link from "next/link";

export function VivaSetsList({ documents }: { documents: any[] }) {
  if (documents.length === 0) {
    return (
      <Card className="border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.012)),rgba(24,24,27,0.9)] p-10 text-center sm:p-12">
        <Sparkles className="mx-auto mb-4 h-16 w-16 text-gray-600" />
        <h3 className="mb-2 text-xl font-semibold">No viva questions yet</h3>
        <p className="mb-6 text-gray-400">Generate viva questions from your uploaded documents</p>
        <Link href="/dashboard/upload">
          <Button className="bg-gradient-to-r from-orange-500 to-red-500">Upload Document</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
      {documents.map((doc) => (
        <Card
          key={doc.id}
          className="group overflow-hidden rounded-[22px] border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.012)),rgba(24,24,27,0.92)] p-0 shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:border-orange-400/30 sm:rounded-[26px]"
        >
          <div className="border-b border-white/10 p-5 sm:p-6">
            <div className="mb-4 flex items-start gap-2.5 sm:gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-950/40 sm:h-11 sm:w-11">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-orange-400/20 bg-orange-400/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-orange-100">
                    Viva Set
                  </span>
                </div>
                <h3 className="mt-3 line-clamp-2 text-base font-semibold text-white">{doc.fileName}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-gray-400">{doc.subject || "General oral revision"}</p>
              </div>
            </div>

            <p className="text-sm leading-6 text-gray-300 sm:leading-7">
              Practice explaining concepts out loud with guided oral questions built from this source document.
            </p>
          </div>

          <div className="space-y-4 p-5 sm:space-y-5 sm:p-6">
            <div className="grid grid-cols-2 gap-2.5 text-sm sm:gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Questions</p>
                <p className="mt-2 font-medium text-white">{(doc as any).vivaQuestions?.length || 0}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Status</p>
                <p className="mt-2 font-medium text-white">Ready</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 sm:p-4">
              <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-gray-500">Source document</p>
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-white/5 p-2">
                  <BookOpen className="h-4 w-4 text-orange-300" />
                </div>
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm leading-6 text-gray-300">{doc.fileName}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 pt-1 md:grid-cols-2">
              <Link href={`/dashboard/viva/${doc.id}/practice`} className="block">
                <Button
                  className="h-11 w-full bg-gradient-to-r from-orange-500 to-red-500 shadow-[0_10px_30px_rgba(249,115,22,0.28)] sm:h-12"
                  size="sm"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Practice
                </Button>
              </Link>
              <Link href={`/dashboard/documents/${doc.id}`} className="block">
                <Button
                  variant="outline"
                  className="h-11 w-full border-white/10 bg-white/[0.02] text-white shadow-[0_10px_30px_rgba(0,0,0,0.12)] hover:border-orange-400/30 hover:bg-orange-400/10 sm:h-12"
                  size="sm"
                >
                  Open document
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
