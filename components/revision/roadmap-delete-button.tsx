"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function RoadmapDeleteButton({
  roadmapId,
  redirectTo = "/dashboard/revision",
  variant = "outline",
  size = "sm",
  className,
  label = "Delete roadmap",
}: {
  roadmapId: string;
  redirectTo?: string;
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "xl" | "icon";
  className?: string;
  label?: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this exam roadmap? This cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/revision-roadmaps/${roadmapId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      toast.success("Roadmap deleted");
      if (redirectTo) {
        router.push(redirectTo);
      }
      router.refresh();
    } catch {
      toast.error("Could not delete roadmap");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="mr-2 h-4 w-4" />
      )}
      {label}
    </Button>
  );
}
