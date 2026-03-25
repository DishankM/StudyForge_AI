"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";

export function useWaitlist() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      if (!email.trim()) {
        setError("Please enter your email");
        return;
      }
      setLoading(true);
      try {
        const res = await fetch("/api/waitlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        });
        const data = await res.json();

        if (!res.ok) {
          const errMsg = data?.error ?? "Something went wrong";
          setError(errMsg);
          toast(errMsg, "error");
          return;
        }

        toast(data?.message ?? "You're on the list!", "success");
        setEmail("");
        setTimeout(() => router.push("/thank-you"), 1500);
      } catch {
        setError("Something went wrong. Please try again.");
        toast("Something went wrong. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    },
    [email, toast, router]
  );

  return { email, setEmail, loading, error, submit };
}
