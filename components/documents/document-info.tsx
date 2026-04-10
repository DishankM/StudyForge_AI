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
  const items = [
    {
      label: "File name",
      value: document.fileName,
      icon: FileText,
    },
    {
      label: "Size",
      value: formatFileSize(document.fileSize),
      icon: HardDrive,
    },
    {
      label: "Subject",
      value: document.subject || "Not set",
      icon: Tag,
    },
    {
      label: "Type",
      value: document.documentType || "Not set",
      icon: FolderOpen,
    },
    {
      label: "Uploaded",
      value: new Date(document.uploadedAt).toLocaleDateString(),
      icon: CalendarDays,
    },
  ];

  return (
    <div className="overflow-hidden rounded-[26px] border border-white/10 bg-zinc-950/80 shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
      <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.18),_transparent_35%)] p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-white sm:text-xl">Document Info</h2>
        <p className="mt-1 text-sm text-gray-400">Reference details for the source file powering generation.</p>
      </div>
      <div className="space-y-3 p-5 text-sm sm:p-6">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3 text-gray-400">
              <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                <item.icon className="h-4 w-4" />
              </div>
              <span>{item.label}</span>
            </div>
            <span className="break-words font-medium text-white sm:max-w-[55%] sm:text-right">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
