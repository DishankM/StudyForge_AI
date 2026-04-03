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
      <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.18),_transparent_35%)] p-6">
        <h2 className="text-xl font-semibold text-white">Document Info</h2>
        <p className="mt-1 text-sm text-gray-400">Reference details for the source file powering generation.</p>
      </div>
      <div className="space-y-3 p-6 text-sm">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4"
          >
            <div className="flex items-center gap-3 text-gray-400">
              <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                <item.icon className="h-4 w-4" />
              </div>
              <span>{item.label}</span>
            </div>
            <span className="max-w-[55%] truncate text-right font-medium text-white">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
