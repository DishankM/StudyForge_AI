"use client";

import { Card } from "@/components/ui/card";

export function ExamPaperViewer({ examPaper }: { examPaper: any }) {
  if (!examPaper) {
    return null;
  }

  const data = examPaper.questions;

  return (
    <div className="space-y-6">
      <Card className="bg-zinc-900 border-white/10 p-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">{data?.header?.examTitle}</h1>
          <p className="text-gray-400">{data?.header?.university}</p>
          <p className="text-gray-400">{data?.header?.subject}</p>
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <span>Duration: {data?.header?.duration}</span>
            <span>Total Marks: {data?.header?.totalMarks}</span>
          </div>
        </div>
      </Card>

      <Card className="bg-zinc-900 border-white/10 p-6">
        <h2 className="text-lg font-semibold mb-4">Instructions</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          {(data?.header?.instructions || []).map((ins: string, i: number) => (
            <li key={i}>{ins}</li>
          ))}
        </ul>
      </Card>

      {(data?.sections || []).map((section: any, idx: number) => (
        <Card key={idx} className="bg-zinc-900 border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{section.name}</h3>
            <span className="text-sm text-gray-400">{section.instructions}</span>
          </div>
          <div className="space-y-4">
            {(section.questions || []).map((q: any, i: number) => (
              <div key={i} className="p-4 rounded-lg bg-zinc-800/50">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-gray-200">
                    <span className="font-semibold">{q.number}.</span> {q.text}
                  </p>
                  <span className="text-sm text-gray-400">{q.marks} marks</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
