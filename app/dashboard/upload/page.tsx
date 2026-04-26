"use client";

import { useState } from "react";
import { FileUploadZone } from "@/components/upload/file-upload-zone";
import { UploadMetadata } from "@/components/upload/upload-metadata";
import { ProcessingQueue } from "@/components/upload/processing-queue";
import { toast } from "sonner";
import { upload } from "@vercel/blob/client";
import { MAX_DOCUMENT_UPLOAD_SIZE, sanitizeUploadFileName } from "@/lib/uploads";
import { Sparkles, UploadCloud } from "lucide-react";

type PreferredOutcome = "notes" | "mcqs" | "viva" | "revision-pack";

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState<
    Array<{
      id: string;
      fileName: string;
      status: "uploading" | "processing" | "completed" | "failed";
      progress: number;
      documentId?: string;
      message?: string;
      preferredOutcome: PreferredOutcome;
    }>
  >([]);

  const handleFilesUpdate = (nextFiles: File[]) => {
    setFiles(nextFiles);
  };

  const handleUpload = async (metadata: {
    subject: string;
    documentType: string;
    examDate?: Date;
    additionalNotes?: string;
    preferredOutcome: PreferredOutcome;
    files: File[];
  }) => {
    if (metadata.files.length === 0) {
      toast.error("Please select at least one file");
      return;
    }

    const nextItems = metadata.files.map((file) => ({
      id: `${file.name}-${Date.now()}`,
      fileName: file.name,
      status: "uploading" as const,
      progress: 10,
      message: "Uploading file",
      preferredOutcome: metadata.preferredOutcome,
    }));

    setProcessing((prev) => [...nextItems, ...prev]);
    let successfulUploads = 0;

    for (const file of metadata.files) {
      const itemId = nextItems.find((i) => i.fileName === file.name)?.id;
      if (!itemId) continue;

      try {
        if (file.size > MAX_DOCUMENT_UPLOAD_SIZE) {
          throw new Error("File is larger than the 50MB upload limit");
        }

        setProcessing((prev) =>
          prev.map((item) =>
            item.id === itemId
              ? { ...item, status: "uploading", progress: 30, message: "Uploading file" }
              : item
          )
        );

        const safePath = `documents/${sanitizeUploadFileName(file.name)}`;
        const blob = await upload(safePath, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
          multipart: file.size > 5 * 1024 * 1024,
          onUploadProgress: ({ percentage }) => {
            setProcessing((prev) =>
              prev.map((item) =>
                item.id === itemId
                  ? {
                  ...item,
                  status: "uploading",
                  progress: Math.max(30, Math.min(65, Math.round(percentage * 0.35 + 30))),
                      message: "Uploading file",
                    }
                  : item
              )
            );
          },
        });

        const response = await fetch("/api/upload/complete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: file.name,
            fileUrl: blob.url,
            fileSize: file.size,
            mimeType: file.type,
            subject: metadata.subject || "",
            documentType: metadata.documentType || "",
          }),
        });

        if (!response.ok) {
          const message = await response.text();
          throw new Error(message || "Upload failed");
        }

        const data = await response.json();

        setProcessing((prev) =>
          prev.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  status: "processing",
                  progress: 70,
                  documentId: data.document?.id,
                  message:
                    metadata.preferredOutcome === "revision-pack"
                      ? "Preparing your revision pack handoff"
                      : "Preparing your next recommended step",
                }
              : item
          )
        );

        // Simulate processing time for UX feedback
        await new Promise((resolve) => setTimeout(resolve, 800));

        setProcessing((prev) =>
          prev.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  status: "completed",
                  progress: 100,
                  documentId: data.document?.id,
                  message:
                    metadata.preferredOutcome === "revision-pack"
                      ? "Ready for notes, MCQs, and viva generation"
                      : "Upload complete. Continue with your selected goal.",
                }
              : item
          )
        );
        successfulUploads += 1;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Upload failed";
        setProcessing((prev) =>
          prev.map((item) =>
            item.id === itemId
              ? { ...item, status: "failed", progress: 100, message }
              : item
          )
        );
        toast.error(`${file.name}: ${message}`);
      }
    }

    setFiles([]);
    if (successfulUploads > 0) {
      const outcomeLabels: Record<PreferredOutcome, string> = {
        notes: "notes",
        mcqs: "MCQs",
        viva: "viva prep",
        "revision-pack": "a revision pack",
      };
      toast.success(
        `Uploaded ${successfulUploads} file${successfulUploads === 1 ? "" : "s"} for ${outcomeLabels[metadata.preferredOutcome]}`
      );
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950/80 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-6 lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.18),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.14),_transparent_32%)]" />
        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-sm font-medium text-pink-200">
              <UploadCloud className="h-4 w-4" />
              Upload workspace
            </div>
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">Upload Documents</h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-gray-300">
              Bring in your PDFs, lecture notes, syllabi, or study material and turn them into usable revision assets.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-gray-400">Accepted formats</p>
              <p className="mt-2 text-xl font-semibold text-white sm:text-2xl">PDF, DOCX, PPTX</p>
              <p className="mt-1 text-sm text-gray-400">Also supports TXT and image-based study sources.</p>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-emerald-200">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.24em]">Ready for AI</span>
              </div>
              <p className="mt-2 text-sm text-emerald-100/90">
                Once uploaded, your documents are ready for notes, MCQs, viva questions, and exam paper generation.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
        <p className="text-sm font-medium text-white">How it works</p>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-gray-300">
          1) Add files  2) Fill subject + type  3) Click <span className="font-semibold text-white">Upload &amp; Process</span>.
          Your generated notes and practice content will appear in Documents.
        </p>
      </div>

      <FileUploadZone onFilesAdded={handleFilesUpdate} files={files} />

      {files.length > 0 && (
        <UploadMetadata files={files} onUpload={handleUpload} onClearFiles={() => setFiles([])} />
      )}

      {processing.length > 0 && <ProcessingQueue items={processing} />}
    </div>
  );
}
