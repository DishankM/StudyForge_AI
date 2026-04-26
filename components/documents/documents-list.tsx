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
        description="Upload your first study file to start generating notes, MCQs, viva questions, and exam-ready content from one place."
        examples={["Lecture PDF", "Class notes", "Syllabus unit", "Past paper"]}
        helperText="Lecture slides and chapter notes usually give the fastest results. After upload, start with notes if you want quick revision or MCQs if you want practice first."
        actionLabel="Upload your first file"
        actionHref="/dashboard/upload"
      />
    );
  }

  return (
    <>
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-gray-300">
        Tip: open a document and use the action buttons to generate new notes or MCQ practice sets.
      </div>

      <div className="space-y-4 md:hidden">
        {documents.map((doc) => (
          <article key={doc.id} className="rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015)),rgba(24,24,27,0.9)] p-5 shadow-[0_16px_36px_rgba(0,0,0,0.2)]">
            <p className="font-medium text-white">{doc.fileName}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-gray-300">
                {doc.subject || "No subject"}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-gray-300">
                {doc.documentType || "No type"}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-400">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Generated</p>
                <p className="mt-1">{doc.notes.length} notes</p>
                <p className="mt-1 flex items-center gap-1">
                  <HelpCircle className="h-3.5 w-3.5" />
                  {doc.mcqSets.length} mcq sets
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Uploaded</p>
                <p className="mt-1">{formatDistanceToNow(new Date(doc.uploadedAt), { addSuffix: true })}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Link href={`/dashboard/documents/${doc.id}`} className="flex-1 sm:flex-none">
                <Button size="sm" className="min-h-11 w-full gap-2 bg-gradient-to-r from-pink-500 to-purple-600 sm:w-auto">
                  <Eye className="h-4 w-4" />
                  Open document
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="min-h-11 flex-1 gap-2 text-red-400 hover:text-red-300 sm:flex-none"
                onClick={() => handleDelete(doc.id)}
                disabled={deletingId === doc.id}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.025),rgba(255,255,255,0.01)),rgba(24,24,27,0.92)] md:block">
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
                      <Button size="sm" className="min-h-11 gap-2 bg-gradient-to-r from-pink-500 to-purple-600">
                        <Eye className="h-4 w-4" />
                        Open
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
    </>
  );
}
