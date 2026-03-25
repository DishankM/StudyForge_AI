"use client";

import { useState } from "react";
import { FileUploadZone } from "@/components/upload/file-upload-zone";
import { UploadMetadata } from "@/components/upload/upload-metadata";
import { ProcessingQueue } from "@/components/upload/processing-queue";
import { toast } from "sonner";

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
    }));

    setProcessing((prev) => [...nextItems, ...prev]);

    for (const file of metadata.files) {
      const itemId = nextItems.find((i) => i.fileName === file.name)?.id;
      if (!itemId) continue;

      try {
        setProcessing((prev) =>
          prev.map((item) =>
            item.id === itemId
              ? { ...item, status: "uploading", progress: 30, message: "Uploading file" }
              : item
          )
        );

        const formData = new FormData();
        formData.append("file", file);
        formData.append("subject", metadata.subject || "");
        formData.append("documentType", metadata.documentType || "");

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
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
                  message: "Processing document",
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
                  message: "Ready for generation",
                }
              : item
          )
        );
      } catch (error) {
        setProcessing((prev) =>
          prev.map((item) =>
            item.id === itemId
              ? { ...item, status: "failed", progress: 100, message: "Upload failed" }
              : item
          )
        );
      }
    }

    setFiles([]);
    toast.success("Upload completed");
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Upload Documents</h1>
        <p className="mt-2 text-gray-400">Upload your PDFs, notes, lectures, or syllabus to get started</p>
      </div>

      <FileUploadZone onFilesAdded={handleFilesUpdate} files={files} />

      {files.length > 0 && (
        <UploadMetadata files={files} onUpload={handleUpload} onClearFiles={() => setFiles([])} />
      )}

      {processing.length > 0 && <ProcessingQueue items={processing} />}
    </div>
  );
}
