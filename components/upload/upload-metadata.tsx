"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { CalendarIcon, BookOpen, Sparkles } from "lucide-react";
import { format } from "date-fns";

const metadataSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  documentType: z.string().min(1, "Document type is required"),
  examDate: z.date().optional(),
  additionalNotes: z.string().optional(),
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

export function UploadMetadata({
  files,
  onUpload,
  onClearFiles,
}: {
  files: File[];
  onUpload: (data: MetadataFormValues & { files: File[] }) => Promise<void> | void;
  onClearFiles: () => void;
}) {
  const [date, setDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<MetadataFormValues>({
    resolver: zodResolver(metadataSchema),
  });

  const onSubmit = async (data: MetadataFormValues) => {
    setIsLoading(true);
    await onUpload({ ...data, examDate: date, files });
    setIsLoading(false);
  };

  return (
    <div className="overflow-hidden rounded-[26px] border border-white/10 bg-zinc-950/80 shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
      <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.18),_transparent_35%)] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Document Details</h2>
            <p className="mt-1 text-sm text-gray-400">Add a little context so your generated content feels more targeted.</p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-gray-400">
            Optional
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
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
              <Button variant="outline" className="mt-2 w-full justify-start text-left font-normal md:w-auto">
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

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90">
            {isLoading ? "Uploading..." : "Upload & Process"}
          </Button>
          <Button type="button" variant="outline" onClick={onClearFiles} disabled={isLoading}>
            Clear Files
          </Button>
        </div>
      </form>
    </div>
  );
}
