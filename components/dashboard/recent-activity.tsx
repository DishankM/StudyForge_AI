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
    <div className="h-full rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015)),rgba(9,9,11,0.86)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white sm:text-xl">Recent Uploads</h2>
          <p className="mt-1 text-sm text-gray-400">Your newest source materials and where to jump back in.</p>
        </div>
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
              <Button className="mt-4 w-full bg-gradient-to-r from-pink-500 to-purple-600 sm:w-auto">
                Upload your first document
              </Button>
            </Link>
            </div>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition hover:border-white/10 hover:bg-white/[0.05]"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 shadow-lg shadow-black/20">
                <FileText className="h-5 w-5 text-white" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-white">{doc.fileName}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Clock className="h-3 w-3 text-gray-500" />
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(doc.uploadedAt), { addSuffix: true })}
                  </p>
                  {doc.subject && (
                    <>
                      <span className="text-gray-600">-</span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-gray-300">
                        {doc.subject}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
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
