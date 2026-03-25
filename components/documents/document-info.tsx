import { CalendarDays, FileText, FolderOpen, Tag, HardDrive } from "lucide-react";

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
}

export function DocumentInfo({ document }: { document: any }) {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900 p-6">
      <h2 className="mb-4 text-xl font-semibold">Document Info</h2>
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-400">
            <FileText className="h-4 w-4" />
            File name
          </div>
          <span className="font-medium text-white">{document.fileName}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-400">
            <HardDrive className="h-4 w-4" />
            Size
          </div>
          <span className="font-medium text-white">{formatFileSize(document.fileSize)}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-400">
            <Tag className="h-4 w-4" />
            Subject
          </div>
          <span className="font-medium text-white">{document.subject || "-"}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-400">
            <FolderOpen className="h-4 w-4" />
            Type
          </div>
          <span className="font-medium text-white">{document.documentType || "-"}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-400">
            <CalendarDays className="h-4 w-4" />
            Uploaded
          </div>
          <span className="font-medium text-white">
            {new Date(document.uploadedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
