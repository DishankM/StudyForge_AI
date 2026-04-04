"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown, Play, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import { AnimatedBackground } from "@/components/shared/animated-background";
import { Button } from "@/components/ui/button";
import { useWaitlist } from "@/lib/use-waitlist";

const badges = [
  "Upload notes, PDFs, and syllabus",
  "Generate notes, MCQs, viva, and exam papers",
  "Built for revision-focused study workflows",
];

export function Hero() {
  const { email, setEmail, loading, error, submit } = useWaitlist();
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-24 text-center sm:px-6 sm:pb-28 sm:pt-28 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-5 flex flex-wrap justify-center gap-2"
        >
          {badges.map((badge, index) => (
            <motion.span
              key={badge}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium leading-5 text-text-secondary sm:px-4 sm:py-2 sm:text-sm"
            >
              {badge}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-3 py-1.5 text-xs font-medium text-pink-200 sm:px-4 sm:text-sm"
        >
          <Sparkles className="h-4 w-4" />
          <span className="truncate">AI study workspace for revision and exam prep</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mb-5 font-heading text-3xl font-bold leading-[1.08] gradient-text sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Turn Your Study Materials Into Exam Success
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto mb-8 max-w-3xl text-base leading-7 text-text-secondary sm:mb-10 sm:text-xl"
        >
          StudyForge helps students upload source material and convert it into structured study assets that are easier to revise, practice, and reuse before exams.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-10 flex flex-col items-stretch justify-center gap-3 sm:mb-12 sm:flex-row sm:items-center"
        >
          {!isLoggedIn && (
            <Button
              variant="default"
              size="xl"
              className="group w-full shadow-glow hover:shadow-[0_0_50px_rgba(255,107,157,0.4)] sm:w-auto"
              asChild
            >
              <Link href="/auth/signup">Start Free Trial</Link>
            </Button>
          )}
          <Button variant="outline" size="xl" className="w-full gap-2 sm:w-auto" asChild>
            <Link href="#demo">
              <Play className="h-5 w-5" />
              See Sample Outputs
            </Link>
          </Button>
        </motion.div>

        {!isLoggedIn && (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            onSubmit={submit}
            className="mx-auto mb-8 flex w-full max-w-md flex-col items-center justify-center gap-2 sm:mb-10 sm:flex-row"
          >
            <input
              type="email"
              placeholder="Enter your email for updates"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-text-primary placeholder:text-text-muted transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-purple disabled:opacity-60 sm:max-w-xs"
              aria-invalid={!!error}
            />
            <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto">
              {loading ? "Joining..." : "Get Early Access"}
            </Button>
            {error && (
              <p className="w-full text-center text-sm text-red-400 sm:text-left" role="alert">
                {error}
              </p>
            )}
          </motion.form>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mx-auto flex max-w-md flex-col items-center justify-center gap-3 text-sm text-text-muted sm:max-w-none sm:flex-row"
        >
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map((index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.05 }}
                className="h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br from-primary-pink to-primary-purple"
              />
            ))}
          </div>
          <span className="max-w-xs text-balance sm:max-w-none">
            Built for students who want faster revision without losing structure
          </span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 sm:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-full border border-white/20 p-2"
        >
          <ChevronDown className="h-6 w-6 text-text-secondary" />
        </motion.div>
      </motion.div>
    </section>
  );
}
