"use client";

import { FileText, GraduationCap, Timer } from "lucide-react";
import { Card } from "@/components/ui/card";

export function ExamPaperViewer({ examPaper }: { examPaper: any }) {
  if (!examPaper) {
    return null;
  }

  const data = examPaper.questions;

  return (
    <div className="space-y-6">
      <Card className="rounded-[28px] border-white/10 bg-zinc-950/80 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-300">
            <GraduationCap className="h-4 w-4 text-emerald-300" />
            Exam paper
          </div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">{data?.header?.examTitle}</h1>
          <p className="text-gray-400">{data?.header?.university}</p>
          <p className="text-gray-400">{data?.header?.subject}</p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <Timer className="h-4 w-4" />
                <span className="text-sm uppercase tracking-[0.22em]">Duration</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-white">{data?.header?.duration}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <FileText className="h-4 w-4" />
                <span className="text-sm uppercase tracking-[0.22em]">Total Marks</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-white">{data?.header?.totalMarks}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="rounded-[26px] border-white/10 bg-zinc-950/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
        <h2 className="mb-4 text-lg font-semibold text-white">Instructions</h2>
        <ul className="list-inside list-disc space-y-1 text-gray-300">
          {(data?.header?.instructions || []).map((instruction: string, index: number) => (
            <li key={index}>{instruction}</li>
          ))}
        </ul>
      </Card>

      {(data?.sections || []).map((section: any, idx: number) => (
        <Card
          key={idx}
          className="rounded-[26px] border-white/10 bg-zinc-950/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.24)]"
        >
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-white">{section.name}</h3>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-gray-400">
              {section.instructions}
            </span>
          </div>

          <div className="space-y-4">
            {(section.questions || []).map((question: any, index: number) => (
              <div key={index} className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <p className="text-gray-200">
                    <span className="font-semibold">{question.number}.</span> {question.text}
                  </p>
                  <span className="text-sm text-gray-400">{question.marks} marks</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
