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
          "relative cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-all",
          isDragActive
            ? "border-pink-500 bg-pink-500/5"
            : "border-white/20 hover:border-pink-500/50 hover:bg-white/5"
        )}
      >
        <input {...getInputProps()} />

        <div className="mx-auto max-w-md space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-600">
            <Upload className="h-8 w-8 text-white" />
          </div>

          <div>
            <p className="text-lg font-semibold">{isDragActive ? "Drop files here..." : "Drag & drop your files here"}</p>
            <p className="mt-2 text-sm text-gray-400">or click to browse from your computer</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
            <span className="rounded bg-zinc-800 px-2 py-1">PDF</span>
            <span className="rounded bg-zinc-800 px-2 py-1">DOCX</span>
            <span className="rounded bg-zinc-800 px-2 py-1">PPTX</span>
            <span className="rounded bg-zinc-800 px-2 py-1">TXT</span>
            <span className="rounded bg-zinc-800 px-2 py-1">Images</span>
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
        <div className="rounded-xl border border-white/10 bg-zinc-900 p-6">
          <h3 className="mb-4 font-semibold">Selected Files ({files.length})</h3>
          <div className="space-y-3">
            {files.map((file, index) => (
              <div key={`${file.name}-${index}`} className="group flex items-center gap-3 rounded-lg bg-zinc-800/50 p-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-purple-600">
                  <FileText className="h-5 w-5 text-white" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                  className="opacity-0 transition-opacity group-hover:opacity-100"
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
