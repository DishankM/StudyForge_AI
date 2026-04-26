"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import { CalendarIcon, BookOpen, CheckCircle2, HelpCircle, Layers3, Sparkles, FileText } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const metadataSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  documentType: z.string().min(1, "Document type is required"),
  examDate: z.date().optional(),
  additionalNotes: z.string().optional(),
  preferredOutcome: z.enum(["notes", "mcqs", "viva", "revision-pack"]),
});

type MetadataFormValues = z.infer<typeof metadataSchema>;

const DOCUMENT_TYPES = [
  "Lecture Notes",
  "Textbook Chapter",
  "Syllabus",
  "Past Paper",
  "Study Material",
  "Other",
];

const OUTCOME_OPTIONS = [
  {
    value: "notes",
    title: "Notes first",
    description: "Best when you want a fast summary before deeper practice.",
    icon: FileText,
  },
  {
    value: "mcqs",
    title: "MCQ practice",
    description: "Best when you already know the topic and want active recall.",
    icon: HelpCircle,
  },
  {
    value: "viva",
    title: "Viva prep",
    description: "Best for oral exams, lab checks, and interview-style review.",
    icon: Sparkles,
  },
  {
    value: "revision-pack",
    title: "Revision pack",
    description: "Best when you want notes, MCQs, and viva flow from one document.",
    icon: Layers3,
  },
] as const;

export function UploadMetadata({
  files,
  onUpload,
  onClearFiles,
}: {
  files: File[];
  onUpload: (data: MetadataFormValues & { files: File[] }) => Promise<void> | void;
  onClearFiles: () => void;
}) {
  const searchParams = useSearchParams();
  const initialOutcome = searchParams.get("action");
  const defaultOutcome = initialOutcome && OUTCOME_OPTIONS.some((option) => option.value === initialOutcome)
    ? (initialOutcome as MetadataFormValues["preferredOutcome"])
    : "notes";
  const [date, setDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<MetadataFormValues>({
    resolver: zodResolver(metadataSchema),
    defaultValues: {
      preferredOutcome: defaultOutcome,
    },
  });
  const preferredOutcome = watch("preferredOutcome");

  const onSubmit = async (data: MetadataFormValues) => {
    setIsLoading(true);
    await onUpload({ ...data, examDate: date, files });
    setIsLoading(false);
  };

  return (
    <div className="overflow-hidden rounded-[26px] border border-white/10 bg-zinc-950/80 shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
      <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.18),_transparent_35%)] p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white sm:text-xl">Document Details</h2>
            <p className="mt-1 text-sm text-gray-400">Add a little context so your generated content feels more targeted.</p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-gray-400">
            Optional
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-5 sm:p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label>What do you want from this upload?</Label>
              <p className="mt-1 text-sm text-gray-400">
                Pick the outcome you want so StudyForge can guide you to the right next step after upload.
              </p>
            </div>
            <div className="rounded-full border border-pink-500/20 bg-pink-500/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-pink-200">
              Start here
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {OUTCOME_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setValue("preferredOutcome", option.value, { shouldValidate: true })}
                className={cn(
                  "rounded-2xl border p-4 text-left transition-all",
                  preferredOutcome === option.value
                    ? "border-pink-500/40 bg-pink-500/10"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-white/5 p-3">
                      <option.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{option.title}</p>
                      <p className="mt-1 text-sm leading-6 text-gray-400">{option.description}</p>
                    </div>
                  </div>
                  {preferredOutcome === option.value && (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-pink-300" />
                  )}
                </div>
              </button>
            ))}
          </div>
          {errors.preferredOutcome && (
            <p className="text-sm text-red-500">{errors.preferredOutcome.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="subject">Subject / Topic</Label>
            <Input
              id="subject"
              placeholder="e.g., Data Structures, Organic Chemistry"
              {...register("subject")}
              className="mt-2"
            />
            {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>}
          </div>

          <div>
            <Label htmlFor="documentType">Document Type</Label>
            <Select onValueChange={(value) => setValue("documentType", value, { shouldValidate: true })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.documentType && <p className="mt-1 text-sm text-red-500">{errors.documentType.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
          <Label>Target Exam Date (Optional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="mt-2 w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto border-white/10 bg-zinc-900 p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-2 text-pink-200">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs uppercase tracking-[0.24em]">Generation context</span>
            </div>
            <p className="mt-3 text-sm text-gray-300">
              Subject and type help StudyForge shape notes, questions, and exam-focused output more accurately.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
              <BookOpen className="h-4 w-4" />
              {files.length} file{files.length === 1 ? "" : "s"} ready to process
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Additional Instructions (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Any specific requirements or focus areas..."
            {...register("additionalNotes")}
            className="mt-2"
            rows={3}
          />
        </div>

        <div className="sticky bottom-3 z-10 -mx-2 rounded-2xl border border-white/10 bg-zinc-950/95 p-3 backdrop-blur-sm sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              type="submit"
              disabled={isLoading}
              className="min-h-11 w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 sm:w-auto"
            >
            {isLoading ? "Uploading..." : "Upload & Continue"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClearFiles}
              disabled={isLoading}
              className="min-h-11 w-full sm:w-auto"
            >
              Clear Files
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
