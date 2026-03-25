"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { resetPassword } from "@/lib/actions/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    setIsLoading(true);
    const result = await resetPassword(data.email);

    if (result?.error) {
      toast.error(result.error);
      setIsLoading(false);
      return;
    }

    toast.success(result.message ?? "Reset link sent!");
    setSent(true);
    setIsLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-primary-pink/20 flex items-center justify-center mx-auto">
            <Icons.check className="h-8 w-8 text-primary-pink" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">
            Check your email
          </h1>
          <p className="text-text-secondary">
            We&apos;ve sent a password reset link. Click it to set a new
            password. The link expires in 1 hour.
          </p>
          <Link href="/auth/login">
            <Button variant="outline">Back to sign in</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div>
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-heading font-bold gradient-text">
              StudyForge
            </h1>
          </Link>
          <h2 className="mt-6 text-2xl font-heading font-bold text-text-primary">
            Forgot password?
          </h2>
          <p className="mt-2 text-text-secondary">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="mt-2"
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-text-secondary">
          <Link href="/auth/login" className="text-primary-pink hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
