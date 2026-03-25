"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { toast } from "sonner";

export default function VerifyRequestPage() {
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    setResending(true);
    // In a full implementation you'd call an action with the user's email from session or a stored email
    toast.info("Resend is available after implementing email storage on signup.");
    setResending(false);
  };

  const handleOpenEmail = () => {
    window.location.href = "mailto:";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md text-center space-y-8">
        <div className="w-20 h-20 rounded-full bg-primary-purple/20 flex items-center justify-center mx-auto">
          <Mail className="h-10 w-10 text-primary-purple" />
        </div>
        <h1 className="text-3xl font-heading font-bold text-text-primary">
          Check your email
        </h1>
        <p className="text-text-secondary text-lg">
          We&apos;ve sent you a verification link. Click it to activate your
          account and start your 7-day free trial.
        </p>
        <p className="text-text-muted text-sm">
          Didn&apos;t receive the email? Check your spam folder or use the
          buttons below.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={handleOpenEmail}
            className="gap-2"
          >
            Open email app
          </Button>
          <Button
            variant="outline"
            onClick={handleResend}
            disabled={resending}
            className="gap-2"
          >
            {resending ? "Sending..." : "Resend verification email"}
          </Button>
        </div>
        <p className="text-sm text-text-muted">
          <Link href="/auth/login" className="text-primary-pink hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
