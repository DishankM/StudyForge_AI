"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { verifyEmail } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing verification link.");
      return;
    }

    verifyEmail(token).then((result) => {
      if (result?.error) {
        setStatus("error");
        setMessage(result.error);
        return;
      }
      setStatus("success");
      const t = setTimeout(() => router.push("/dashboard"), 3000);
      return () => clearTimeout(t);
    });
  }, [token, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-background">
        <div className="text-center space-y-6">
          <Icons.spinner className="h-12 w-12 animate-spin text-primary-purple mx-auto" />
          <p className="text-text-secondary">Verifying your email...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
            <span className="text-2xl">✕</span>
          </div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">
            Verification failed
          </h1>
          <p className="text-text-secondary">{message}</p>
          <Link href="/auth/verify-request">
            <Button>Request new link</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-primary-pink/20 flex items-center justify-center mx-auto">
          <Icons.check className="h-8 w-8 text-primary-pink" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-text-primary">
          Email verified!
        </h1>
        <p className="text-text-secondary">
          Your account is active. Redirecting to dashboard in 3 seconds...
        </p>
        <Link href="/dashboard">
          <Button>Go to dashboard now</Button>
        </Link>
      </div>
    </div>
  );
}
