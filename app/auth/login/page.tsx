"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { loginSchema } from "@/lib/validations/auth";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          toast.error("Invalid credentials");
        } else if (result.error === "AccessDenied") {
          toast.error("Please verify your email before logging in.");
        } else {
          toast.error(result.error);
        }
        return;
      }

      toast.success("Welcome back!");
      // Force navigation in case the router doesn't transition in production.
      window.location.href = "/dashboard";
    } finally {
      setIsLoading(false);
    }
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
              Welcome back
            </h2>
            <p className="mt-2 text-text-secondary">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="mt-2"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.email.message}
                </p>
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
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/20 bg-white/5 text-primary-purple focus:ring-primary-purple"
                />
                <span className="text-sm text-text-secondary">
                  Remember me
                </span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary-pink hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
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
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-primary-pink hover:underline font-semibold"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-pink/10 via-primary-purple/10 to-primary-violet/10 items-center justify-center p-8">
        <div className="max-w-md space-y-6">
          <div className="inline-block px-3 py-1 rounded-full bg-primary-purple/20 text-primary-purple text-sm font-semibold">
            ⚡ AI-Powered
          </div>
          <h2 className="text-4xl font-heading font-bold text-text-primary">
            Transform your study materials in seconds
          </h2>
          <p className="text-text-secondary text-lg">
            Join 10,000+ students who&apos;ve improved their exam scores with
            StudyForge.
          </p>
          <div className="space-y-4">
            {[
              { title: "Smart Notes Generation", desc: "Convert 100-page PDFs into concise notes in 2 minutes" },
              { title: "Unlimited MCQ Practice", desc: "Generate exam-style questions with detailed explanations" },
              { title: "University Exam Papers", desc: "Create practice papers in your university's exact format" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-r from-primary-pink to-primary-purple flex items-center justify-center">
                  <Icons.check className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">{item.title}</h3>
                  <p className="text-sm text-text-secondary">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
