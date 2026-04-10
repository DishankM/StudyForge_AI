"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ACCEPTED_UPLOAD_TYPES, MAX_DOCUMENT_UPLOAD_SIZE } from "@/lib/uploads";

export function FileUploadZone({
  onFilesAdded,
  files,
}: {
  onFilesAdded: (files: File[]) => void;
  files: File[];
}) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesAdded([...files, ...acceptedFiles]);
    },
    [files, onFilesAdded]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: ACCEPTED_UPLOAD_TYPES,
    maxSize: MAX_DOCUMENT_UPLOAD_SIZE,
    multiple: true,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    onFilesAdded(newFiles);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "relative overflow-hidden cursor-pointer rounded-[28px] border-2 border-dashed p-6 text-center transition-all sm:p-10 lg:p-12",
          isDragActive
            ? "border-pink-500 bg-pink-500/5"
            : "border-white/20 bg-zinc-950/70 hover:border-pink-500/50 hover:bg-white/5"
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.12),_transparent_36%)]" />
        <input {...getInputProps()} />

        <div className="relative mx-auto max-w-md space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-gradient-to-br from-pink-500 to-purple-600 shadow-[0_20px_40px_rgba(168,85,247,0.35)] sm:h-20 sm:w-20">
            <Upload className="h-7 w-7 text-white sm:h-8 sm:w-8" />
          </div>

          <div>
            <p className="text-base font-semibold text-white sm:text-lg">{isDragActive ? "Drop files here..." : "Drag and drop your files here"}</p>
            <p className="mt-2 text-sm text-gray-400">or click to browse from your computer</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">PDF</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">DOCX</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">PPTX</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">TXT</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Images</span>
          </div>

          <p className="text-xs text-gray-500">Maximum file size: 50MB</p>
        </div>
      </div>

      {fileRejections.length > 0 && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
          <p className="mb-2 text-sm font-semibold text-red-400">Some files were rejected:</p>
          <ul className="space-y-1 text-xs text-red-400">
            {fileRejections.map(({ file, errors }) => (
              <li key={file.name}>
                {file.name} - {errors[0].message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {files.length > 0 && (
        <div className="rounded-[26px] border border-white/10 bg-zinc-950/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.24)] sm:p-6">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h3 className="font-semibold text-white">Selected Files ({files.length})</h3>
              <p className="mt-1 text-sm text-gray-400">Review the files queued for upload before processing.</p>
            </div>
          </div>
          <div className="space-y-3">
            {files.map((file, index) => (
              <div key={`${file.name}-${index}`} className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600">
                  <FileText className="h-5 w-5 text-white" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-white">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                  className="opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
