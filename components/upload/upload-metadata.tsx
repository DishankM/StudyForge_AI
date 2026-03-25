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
import { CalendarIcon } from "lucide-react";
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
    <div className="rounded-xl border border-white/10 bg-zinc-900 p-6">
      <h2 className="mb-6 text-xl font-semibold">Document Details (Optional)</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

        <div className="flex gap-3">
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
