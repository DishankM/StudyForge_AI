"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Play, FileText } from "lucide-react";
import Link from "next/link";

export function VivaSetsList({ documents }: { documents: any[] }) {
  if (documents.length === 0) {
    return (
      <Card className="border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.012)),rgba(24,24,27,0.9)] p-10 text-center sm:p-12">
        <Sparkles className="mx-auto mb-4 h-16 w-16 text-gray-600" />
        <h3 className="mb-2 text-xl font-semibold">No viva questions yet</h3>
        <p className="mb-6 text-gray-400">Generate viva questions from your uploaded documents</p>
        <Link href="/dashboard/upload">
          <Button className="bg-gradient-to-r from-pink-500 to-purple-600">Upload Document</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {documents.map((doc) => (
        <Card
          key={doc.id}
          className="border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.012)),rgba(24,24,27,0.9)] p-6 transition-all hover:border-orange-500/30"
        >
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold">{doc.fileName}</h3>
              <p className="mt-1 text-xs text-gray-500">{doc.subject || "General"}</p>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-gray-400">
              {(doc as any).vivaQuestions?.length || 0} questions
            </span>
            <span className="rounded bg-orange-500/10 px-2 py-1 text-xs text-orange-400">Ready</span>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href={`/dashboard/viva/${doc.id}/practice`} className="flex-1">
              <Button variant="outline" className="w-full" size="sm">
                <Play className="mr-2 h-3 w-3" />
                Practice
              </Button>
            </Link>
            <Link href={`/dashboard/documents/${doc.id}`} className="sm:flex-none">
              <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                <FileText className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}
