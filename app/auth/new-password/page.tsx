"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { newPasswordSchema } from "@/lib/validations/auth";
import { newPassword } from "@/lib/actions/auth";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { toast } from "sonner";

function NewPasswordContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
  });

  const password = watch("password", "");
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasMinLength = password.length >= 8;

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset link");
    }
  }, [token]);

  const onSubmit = async (data: z.infer<typeof newPasswordSchema>) => {
    if (!token) return;
    setIsLoading(true);
    const result = await newPassword(token, data.password);

    if (result?.error) {
      toast.error(result.error);
      setIsLoading(false);
      return;
    }

    toast.success("Password updated! Sign in with your new password.");
    router.push("/auth/login");
    router.refresh();
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-background">
        <div className="text-center space-y-4">
          <p className="text-text-secondary">Invalid or expired reset link.</p>
          <Link href="/auth/forgot-password">
            <Button>Request new link</Button>
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
            Set new password
          </h2>
          <p className="mt-2 text-text-secondary">
            Choose a strong password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label htmlFor="password">New password</Label>
            <div className="relative mt-2">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                {showPassword ? (
                  <Icons.eyeOff className="h-5 w-5" />
                ) : (
                  <Icons.eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <span
                className={`text-xs ${hasMinLength ? "text-primary-pink" : "text-text-muted"}`}
              >
                ● 8+ chars
              </span>
              <span
                className={`text-xs ${hasUpper ? "text-primary-pink" : "text-text-muted"}`}
              >
                ● Uppercase
              </span>
              <span
                className={`text-xs ${hasLower ? "text-primary-pink" : "text-text-muted"}`}
              >
                ● Lowercase
              </span>
              <span
                className={`text-xs ${hasNumber ? "text-primary-pink" : "text-text-muted"}`}
              >
                ● Number
              </span>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="mt-2"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-400">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update password"
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

export default function NewPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-8 bg-background">
          <div className="text-center space-y-4">
            <p className="text-text-secondary">Loading reset form...</p>
          </div>
        </div>
      }
    >
      <NewPasswordContent />
    </Suspense>
  );
}
