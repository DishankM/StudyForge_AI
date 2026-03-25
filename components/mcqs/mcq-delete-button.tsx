"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type McqDeleteButtonProps = {
  mcqSetId: string;
  redirectTo?: string;
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "xl" | "icon";
  className?: string;
  label?: string;
};

export function McqDeleteButton({
  mcqSetId,
  redirectTo = "/dashboard/mcqs",
  variant = "ghost",
  size = "sm",
  className,
  label = "Delete",
}: McqDeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this MCQ set? This cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/mcqs/${mcqSetId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      toast.success("MCQ set deleted");
      if (redirectTo) {
        router.push(redirectTo);
      }
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete MCQ set");
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
