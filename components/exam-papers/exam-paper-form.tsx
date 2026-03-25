"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

const examPaperSchema = z.object({
  title: z.string().min(1, "Title is required"),
  university: z.string().min(1, "University is required"),
  subject: z.string().min(1, "Subject is required"),
  duration: z.number().min(30, "Minimum 30 minutes"),
  totalMarks: z.number().min(10, "Minimum 10 marks"),
  template: z.string().min(1, "Template is required"),
});

const UNIVERSITY_TEMPLATES = [
  { id: "mumbai", name: "Mumbai University" },
  { id: "delhi", name: "Delhi University" },
  { id: "anna", name: "Anna University" },
  { id: "pune", name: "Pune University" },
  { id: "vtu", name: "VTU (Visvesvaraya Technological University)" },
  { id: "cbcs", name: "CBCS Format (Generic)" },
  { id: "custom", name: "Custom Format" },
];

interface Section {
  id: string;
  name: string;
  type: string;
  questionCount: number;
  marksPerQuestion: number;
  instructions: string;
}

interface DocumentOption {
  id: string;
  fileName: string;
  subject: string | null;
  documentType: string | null;
}

export function ExamPaperForm({
  userId,
  documents,
}: {
  userId: string;
  documents: DocumentOption[];
}) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [sections, setSections] = useState<Section[]>([
    {
      id: "1",
      name: "Section A",
      type: "short-answer",
      questionCount: 10,
      marksPerQuestion: 2,
      instructions: "Answer any 8 questions",
    },
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(examPaperSchema),
    defaultValues: {
      duration: 180,
      totalMarks: 100,
    },
  });

  const addSection = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      name: `Section ${String.fromCharCode(65 + sections.length)}`,
      type: "short-answer",
      questionCount: 5,
      marksPerQuestion: 5,
      instructions: "",
    };
    setSections([...sections, newSection]);
  };

  const removeSection = (id: string) => {
    setSections(sections.filter((s) => s.id !== id));
  };

  const updateSection = (id: string, field: keyof Section, value: any) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const onSubmit = async (data: any) => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate/exam-paper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          userId,
          sections,
          documentIds: selectedDocumentId ? [selectedDocumentId] : [],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate exam paper");
      }

      const result = await response.json();
      toast.success("Exam paper generated successfully!");
      router.push(`/dashboard/exam-papers/${result.examPaper.id}`);
    } catch (error) {
      toast.error("Failed to generate exam paper");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="border-white/10 bg-zinc-900 p-6">
        <h2 className="mb-6 text-xl font-semibold">Exam Details</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label htmlFor="document">Source Document (Optional)</Label>
            {documents.length === 0 ? (
              <div className="mt-2 rounded-lg border border-white/10 bg-zinc-800/50 p-4 text-sm text-gray-300">
                No documents found. Upload a document to generate from it, or continue with title
                only.
                <div className="mt-2">
                  <Link href="/dashboard/upload" className="text-pink-400 hover:text-pink-300">
                    Upload a document
                  </Link>
                </div>
              </div>
            ) : (
              <Select
                value={selectedDocumentId ?? "none"}
                onValueChange={(value) =>
                  setSelectedDocumentId(value === "none" ? null : value)
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Use title only (no document)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Use title only</SelectItem>
                  {documents.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id}>
                      {doc.fileName}
                      {doc.subject ? ` • ${doc.subject}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div>
            <Label htmlFor="title">Exam Title</Label>
            <Input
              id="title"
              placeholder="e.g., Data Structures End Semester Exam"
              {...register("title")}
              className="mt-2"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{String(errors.title.message)}</p>
            )}
          </div>

          <div>
            <Label htmlFor="university">University</Label>
            <Select onValueChange={(value) => setValue("university", value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select university" />
              </SelectTrigger>
              <SelectContent>
                {UNIVERSITY_TEMPLATES.map((uni) => (
                  <SelectItem key={uni.id} value={uni.id}>
                    {uni.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.university && (
              <p className="mt-1 text-sm text-red-500">{String(errors.university.message)}</p>
            )}
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="e.g., Computer Science"
              {...register("subject")}
              className="mt-2"
            />
            {errors.subject && (
              <p className="mt-1 text-sm text-red-500">{String(errors.subject.message)}</p>
            )}
          </div>

          <div>
            <Label htmlFor="template">Template Style</Label>
            <Select onValueChange={(value) => setValue("template", value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                {UNIVERSITY_TEMPLATES.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              {...register("duration", { valueAsNumber: true })}
              className="mt-2"
            />
            {errors.duration && (
              <p className="mt-1 text-sm text-red-500">{String(errors.duration.message)}</p>
            )}
          </div>

          <div>
            <Label htmlFor="totalMarks">Total Marks</Label>
            <Input
              id="totalMarks"
              type="number"
              {...register("totalMarks", { valueAsNumber: true })}
              className="mt-2"
            />
            {errors.totalMarks && (
              <p className="mt-1 text-sm text-red-500">{String(errors.totalMarks.message)}</p>
            )}
          </div>
        </div>
      </Card>

      <Card className="border-white/10 bg-zinc-900 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Exam Sections</h2>
          <Button type="button" onClick={addSection} variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Section
          </Button>
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <div
              key={section.id}
              className="rounded-lg border border-white/10 bg-zinc-800/50 p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">{section.name}</h3>
                {sections.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSection(section.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <Label>Question Type</Label>
                  <Select
                    value={section.type}
                    onValueChange={(value) => updateSection(section.id, "type", value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mcq">Multiple Choice</SelectItem>
                      <SelectItem value="short-answer">Short Answer</SelectItem>
                      <SelectItem value="long-answer">Long Answer</SelectItem>
                      <SelectItem value="essay">Essay</SelectItem>
                      <SelectItem value="case-study">Case Study</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Number of Questions</Label>
                  <Input
                    type="number"
                    value={section.questionCount}
                    onChange={(e) =>
                      updateSection(section.id, "questionCount", parseInt(e.target.value))
                    }
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Marks per Question</Label>
                  <Input
                    type="number"
                    value={section.marksPerQuestion}
                    onChange={(e) =>
                      updateSection(section.id, "marksPerQuestion", parseInt(e.target.value))
                    }
                    className="mt-2"
                  />
                </div>

                <div className="md:col-span-3">
                  <Label>Instructions (Optional)</Label>
                  <Input
                    value={section.instructions}
                    onChange={(e) => updateSection(section.id, "instructions", e.target.value)}
                    placeholder="e.g., Answer any 8 questions"
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isGenerating}
          className="bg-gradient-to-r from-pink-500 to-purple-600"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Exam Paper"
          )}
        </Button>
      </div>
    </form>
  );
}
