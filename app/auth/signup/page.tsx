"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { signupSchema } from "@/lib/validations/auth";
import { signup } from "@/lib/actions/auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { toast } from "sonner";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  });

  const password = watch("password", "");
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasMinLength = password.length >= 8;

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    const result = await signup(data.name, data.email, data.password);

    if (result?.error) {
      toast.error(result.error);
      setIsLoading(false);
      return;
    }

    toast.success(result.message ?? "Verification email sent!");
    router.push("/auth/verify-request");
    router.refresh();
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch {
      toast.error("Something went wrong");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-background">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <Link href="/" className="inline-block">
              <h1 className="text-3xl font-heading font-bold gradient-text">
                StudyForge
              </h1>
            </Link>
            <h2 className="mt-6 text-3xl font-heading font-bold text-text-primary">
              Create your account
            </h2>
            <p className="mt-2 text-text-secondary">
              Start your 7-day free trial. No credit card required.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                className="mt-2"
                {...register("name")}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
              )}
            </div>

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

            <div>
              <Label htmlFor="password">Password</Label>
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

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                required
                className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-primary-purple"
              />
              <span className="text-sm text-text-secondary">
                I agree to the{" "}
                <Link href="/terms" className="text-primary-pink hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary-pink hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-text-muted">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full"
          >
            <Icons.google className="mr-2 h-5 w-5" />
            Continue with Google
          </Button>

          <p className="text-center text-sm text-text-secondary">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-primary-pink hover:underline font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-pink/10 via-primary-purple/10 to-primary-violet/10 items-center justify-center p-8">
        <div className="max-w-md space-y-6">
          <h2 className="text-4xl font-heading font-bold text-text-primary">
            Get exam-ready in minutes, not days
          </h2>
          <p className="text-text-secondary text-lg">
            Upload your materials once. Get short notes, MCQs, viva questions,
            and exam papers—all powered by AI.
          </p>
          <ul className="space-y-3">
            {["7-day free trial", "No credit card required", "Cancel anytime"].map(
              (item) => (
                <li key={item} className="flex items-center gap-2 text-text-secondary">
                  <Icons.check className="h-5 w-5 text-primary-pink shrink-0" />
                  {item}
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
