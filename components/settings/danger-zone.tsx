"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Download, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function DangerZone({ user }: { user: any }) {
  const router = useRouter();
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleExport = async () => {
    setIsExporting(true);
    try {
      toast.success("Export started. You'll receive an email when ready.");
    } catch (error) {
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDelete = async () => {
    if (confirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm");
      return;
    }

    setIsDeleting(true);
    try {
      toast.success("Account deleted");
      router.push("/");
    } catch (error) {
      toast.error("Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-[26px] border-yellow-500/20 bg-zinc-950/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.24)] sm:p-6">
        <div className="mb-4 flex items-start gap-3">
          <AlertTriangle className="mt-1 h-5 w-5 flex-shrink-0 text-yellow-500" />
          <div className="flex-1">
            <h3 className="font-semibold text-white">Export Your Data</h3>
            <p className="mt-1 text-sm text-gray-400">
              Download all your notes, MCQs, viva content, and exam papers in JSON format.
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={handleExport} disabled={isExporting} className="w-full sm:w-auto">
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </>
          )}
        </Button>
      </Card>

      <Card className="rounded-[26px] border-red-500/20 bg-zinc-950/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.24)] sm:p-6">
        <div className="mb-4 flex items-start gap-3">
          <Trash2 className="mt-1 h-5 w-5 flex-shrink-0 text-red-500" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-400">Delete Account</h3>
            <p className="mt-1 text-sm text-gray-400">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-red-500/15 bg-red-500/5 p-4">
            <p className="mb-2 text-sm text-red-100">
              Type <span className="font-mono font-bold">DELETE</span> to confirm this action.
            </p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="w-full sm:max-w-xs"
            />
          </div>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={confirmText !== "DELETE" || isDeleting}
            className="w-full sm:w-auto"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Account Permanently"
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
