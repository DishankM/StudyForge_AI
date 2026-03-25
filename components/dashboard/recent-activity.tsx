"use client";

import { formatDistanceToNow } from "date-fns";
import { FileText, Clock, MoreVertical } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type RecentDocument = {
  id: string;
  fileName: string;
  uploadedAt: Date;
  subject: string | null;
};

export function RecentActivity({ documents }: { documents: RecentDocument[] }) {
  return (
    <div className="h-full rounded-xl border border-white/10 bg-zinc-900 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recent Uploads</h2>
        <Link href="/dashboard/documents">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            View all
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {documents.length === 0 ? (
          <div className="py-12 text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-gray-600" />
            <p className="text-gray-400">No documents uploaded yet</p>
            <Link href="/dashboard/upload">
              <Button className="mt-4 bg-gradient-to-r from-pink-500 to-purple-600">
                Upload your first document
              </Button>
            </Link>
          </div>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="group flex items-center gap-4 rounded-lg bg-zinc-800/50 p-4 transition-colors hover:bg-zinc-800"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-purple-500">
                <FileText className="h-5 w-5 text-white" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{doc.fileName}</p>
                <div className="mt-1 flex items-center gap-2">
                  <Clock className="h-3 w-3 text-gray-500" />
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(doc.uploadedAt), { addSuffix: true })}
                  </p>
                  {doc.subject && (
                    <>
                      <span className="text-gray-600">-</span>
                      <span className="text-xs text-gray-500">{doc.subject}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <Link href={`/dashboard/documents/${doc.id}`}>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </Link>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
