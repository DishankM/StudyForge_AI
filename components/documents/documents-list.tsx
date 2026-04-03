"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { FileText, Eye, HelpCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/shared/empty-state";

type DocumentItem = {
  id: string;
  fileName: string;
  subject: string | null;
  documentType: string | null;
  uploadedAt: Date;
  notes: Array<{ id: string }>;
  mcqSets: Array<{ id: string }>;
};

export function DocumentsList({ documents }: { documents: DocumentItem[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (documentId: string) => {
    if (!confirm("Are you sure you want to delete this document? This cannot be undone.")) {
      return;
    }

    setDeletingId(documentId);
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      toast.success("Document deleted");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete document");
    } finally {
      setDeletingId(null);
    }
  };

  if (documents.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No documents yet"
        description="Upload your first PDF, DOCX, or notes file to start generating notes, MCQs, viva questions, and exam papers."
        actionLabel="Upload your first file"
        actionHref="/dashboard/upload"
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-zinc-800/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">File</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Subject</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Type</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Generated</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Uploaded</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-white/5">
                <td className="px-6 py-4 text-sm font-medium text-white">{doc.fileName}</td>
                <td className="px-6 py-4 text-sm text-gray-400">{doc.subject || "-"}</td>
                <td className="px-6 py-4 text-sm text-gray-400">{doc.documentType || "-"}</td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  <div className="flex items-center gap-3">
                    <span>{doc.notes.length} notes</span>
                    <span className="flex items-center gap-1">
                      <HelpCircle className="h-3.5 w-3.5" />
                      {doc.mcqSets.length} mcq sets
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  {formatDistanceToNow(new Date(doc.uploadedAt), { addSuffix: true })}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/dashboard/documents/${doc.id}`}>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-red-400 hover:text-red-300"
                      onClick={() => handleDelete(doc.id)}
                      disabled={deletingId === doc.id}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
