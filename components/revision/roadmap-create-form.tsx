"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Map } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { GenerationProgress } from "@/components/generation/generation-progress";
import { cn } from "@/lib/utils";
import type { PreparationLevel } from "@/lib/types/revision-roadmap";

const ROADMAP_STAGES = [
  "Reading your sources",
  "Summarizing key units",
  "Building exam strategy",
  "Drafting daily plan",
  "Saving your roadmap",
];

const formSchema = z
  .object({
    subjectName: z.string().min(1, "Subject is required"),
    examDate: z.date({ required_error: "Pick your exam date" }),
    studyHoursPerDay: z.coerce.number().min(1).max(12),
    preparationLevel: z.enum(["just-starting", "somewhat-prepared", "revision-mode"]),
    documentId: z.string().optional(),
    syllabusText: z.string().optional(),
    examPattern: z.string().optional(),
    focusAreas: z.string().optional(),
  })
  .refine(
    (data) =>
      Boolean(data.documentId && data.documentId.length > 0) ||
      Boolean(data.syllabusText && data.syllabusText.trim().length >= 24),
    {
      message: "Paste a syllabus outline (24+ characters) or select a document",
      path: ["syllabusText"],
    }
  );

type FormValues = z.infer<typeof formSchema>;

type DocumentOption = {
  id: string;
  fileName: string;
  subject: string | null;
  documentType: string | null;
};

const PREP_LABELS: Record<PreparationLevel, string> = {
  "just-starting": "Just starting",
  "somewhat-prepared": "Somewhat prepared",
  "revision-mode": "Revision mode",
};

export function RoadmapCreateForm({
  userId,
  documents,
}: {
  userId: string;
  documents: DocumentOption[];
}) {
  void userId;
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(8);
  const [stageIndex, setStageIndex] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subjectName: "",
      studyHoursPerDay: 2,
      preparationLevel: "somewhat-prepared",
      syllabusText: "",
      examPattern: "",
      focusAreas: "",
      documentId: "",
    },
  });

  const examDate = watch("examDate");
  const preparationLevel = watch("preparationLevel");
  const documentId = watch("documentId");

  useEffect(() => {
    if (!isGenerating) return;

    const maxProgress = 92;
    const interval = window.setInterval(() => {
      setProgress((current) => {
        const next = Math.min(current + 5, maxProgress);
        const stageSize = maxProgress / ROADMAP_STAGES.length;
        setStageIndex(Math.min(ROADMAP_STAGES.length - 1, Math.floor(next / stageSize)));
        return next;
      });
    }, 1100);

    return () => window.clearInterval(interval);
  }, [isGenerating]);

  const onSubmit = async (data: FormValues) => {
    setIsGenerating(true);
    setProgress(8);
    setStageIndex(0);

    try {
      const response = await fetch("/api/generate/revision-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectName: data.subjectName,
          examDate: data.examDate.toISOString(),
          studyHoursPerDay: data.studyHoursPerDay,
          preparationLevel: data.preparationLevel,
          documentId: data.documentId || undefined,
          syllabusText: data.syllabusText?.trim() || undefined,
          examPattern: data.examPattern?.trim() || undefined,
          focusAreas: data.focusAreas?.trim() || undefined,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || "Could not generate roadmap");
      }

      if (!payload.id) {
        throw new Error("Missing roadmap id from server");
      }

      toast.success("Exam roadmap ready");
      router.push(`/dashboard/revision/${payload.id}`);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Generation failed";
      toast.error(message);
    } finally {
      setIsGenerating(false);
      setProgress(8);
      setStageIndex(0);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {isGenerating && (
        <GenerationProgress
          title="Building your exam roadmap"
          description="We are reading your material and shaping a day-by-day plan that matches your timeline."
          progress={progress}
          stageLabel={ROADMAP_STAGES[stageIndex]}
        />
      )}

      <Card className="border-white/10 bg-zinc-900 p-6">
        <h2 className="text-xl font-semibold text-white">Exam context</h2>
        <p className="mt-1 text-sm text-gray-400">
          Tie the roadmap to a subject and exam date. Add a document, syllabus text, or both for richer output.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label htmlFor="subjectName">Subject</Label>
            <Input
              id="subjectName"
              placeholder="e.g. Organic Chemistry II"
              className="mt-2 border-white/10 bg-zinc-950"
              disabled={isGenerating}
              {...register("subjectName")}
            />
            {errors.subjectName && (
              <p className="mt-1 text-sm text-red-400">{errors.subjectName.message}</p>
            )}
          </div>

          <div>
            <Label>Exam date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isGenerating}
                  className={cn(
                    "mt-2 w-full justify-start border-white/10 bg-zinc-950 text-left font-normal",
                    !examDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 shrink-0 opacity-70" />
                  {examDate ? format(examDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto border-white/10 bg-zinc-900 p-0" align="start">
                <Calendar
                  mode="single"
                  selected={examDate}
                  onSelect={(d) => d && setValue("examDate", d, { shouldValidate: true })}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.examDate && (
              <p className="mt-1 text-sm text-red-400">{errors.examDate.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="hours">Study hours per day</Label>
            <Input
              id="hours"
              type="number"
              min={1}
              max={12}
              className="mt-2 border-white/10 bg-zinc-950"
              disabled={isGenerating}
              {...register("studyHoursPerDay", { valueAsNumber: true })}
            />
            {errors.studyHoursPerDay && (
              <p className="mt-1 text-sm text-red-400">{errors.studyHoursPerDay.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label>Where you stand</Label>
            <Select
              value={preparationLevel}
              onValueChange={(v) =>
                setValue("preparationLevel", v as PreparationLevel, { shouldValidate: true })
              }
              disabled={isGenerating}
            >
              <SelectTrigger className="mt-2 border-white/10 bg-zinc-950">
                <SelectValue placeholder="Preparation level" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-zinc-900">
                {(Object.keys(PREP_LABELS) as PreparationLevel[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {PREP_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="documentId">Source document (optional)</Label>
            <Select
              value={documentId || "__none__"}
              onValueChange={(v) =>
                setValue("documentId", v === "__none__" ? "" : v, { shouldValidate: true })
              }
              disabled={isGenerating}
            >
              <SelectTrigger id="documentId" className="mt-2 border-white/10 bg-zinc-950">
                <SelectValue placeholder="No document" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-zinc-900">
                <SelectItem value="__none__">No document — syllabus text only</SelectItem>
                {documents.map((doc) => (
                  <SelectItem key={doc.id} value={doc.id}>
                    {doc.fileName}
                    {doc.subject ? ` · ${doc.subject}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {documents.length === 0 && (
              <p className="mt-2 text-sm text-gray-500">
                No uploads yet.{" "}
                <Link href="/dashboard/upload" className="text-pink-400 underline-offset-4 hover:underline">
                  Upload a PDF or notes
                </Link>{" "}
                or paste syllabus text below.
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="syllabusText">Syllabus or unit outline (optional)</Label>
            <Textarea
              id="syllabusText"
              placeholder="Paste chapter titles, learning outcomes, or a rough syllabus…"
              rows={6}
              className="mt-2 resize-y border-white/10 bg-zinc-950"
              disabled={isGenerating}
              {...register("syllabusText")}
            />
            {errors.syllabusText && (
              <p className="mt-1 text-sm text-red-400">{errors.syllabusText.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="examPattern">Exam pattern (optional)</Label>
            <Input
              id="examPattern"
              placeholder="e.g. 50 MCQ, 5 long answers"
              className="mt-2 border-white/10 bg-zinc-950"
              disabled={isGenerating}
              {...register("examPattern")}
            />
          </div>

          <div>
            <Label htmlFor="focusAreas">Focus areas (optional)</Label>
            <Input
              id="focusAreas"
              placeholder="e.g. Mechanisms, numericals"
              className="mt-2 border-white/10 bg-zinc-950"
              disabled={isGenerating}
              {...register("focusAreas")}
            />
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          disabled={isGenerating}
          className="bg-gradient-to-r from-pink-500 to-purple-600"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <Map className="mr-2 h-4 w-4" />
              Generate exam roadmap
            </>
          )}
        </Button>
        <Button type="button" variant="outline" asChild disabled={isGenerating}>
          <Link href="/dashboard/revision">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
