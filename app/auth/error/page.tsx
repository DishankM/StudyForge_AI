"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const messages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "Access denied.",
    Verification: "The verification link may have expired or already been used.",
    Default: "An error occurred during sign in.",
  };

  const message = error ? messages[error] ?? messages.Default : messages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md text-center space-y-6">
        <h1 className="text-2xl font-heading font-bold text-text-primary">
          Sign in error
        </h1>
        <p className="text-text-secondary">{message}</p>
        <Link href="/auth/login">
          <Button>Try again</Button>
        </Link>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-8 bg-background">
          <div className="w-full max-w-md text-center space-y-6">
            <h1 className="text-2xl font-heading font-bold text-text-primary">
              Sign in error
            </h1>
            <p className="text-text-secondary">Loading error details...</p>
          </div>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
