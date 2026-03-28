"use client";

import { useState } from "react";
import { FileUploadZone } from "@/components/upload/file-upload-zone";
import { UploadMetadata } from "@/components/upload/upload-metadata";
import { ProcessingQueue } from "@/components/upload/processing-queue";
import { toast } from "sonner";
import { upload } from "@vercel/blob/client";
import { MAX_DOCUMENT_UPLOAD_SIZE, sanitizeUploadFileName } from "@/lib/uploads";

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
      toast.success(`Uploaded ${successfulUploads} file${successfulUploads === 1 ? "" : "s"}`);
    }
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
