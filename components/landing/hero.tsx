"use client";

import { motion } from "framer-motion";
import { Play, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AnimatedBackground } from "@/components/shared/animated-background";
import { useWaitlist } from "@/lib/use-waitlist";
import { useSession } from "next-auth/react";

const badges = [
  "🚀 10x Faster Learning",
  "🎯 95% Exam Success Rate",
  "⚡ AI-Powered",
];

export function Hero() {
  const { email, setEmail, loading, error, submit } = useWaitlist();
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-2 mb-6"
        >
          {badges.map((badge, i) => (
            <motion.span
              key={badge}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="px-4 py-2 rounded-full glass text-sm font-medium text-text-secondary"
            >
              {badge}
            </motion.span>
          ))}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-6 gradient-text"
        >
          Transform Your Study Materials Into Exam Success
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto mb-10"
        >
          AI-powered platform that converts PDFs, lectures, and notes into short
          notes, MCQs, exam papers, and revision plans in seconds
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          {!isLoggedIn && (
            <Button
              variant="default"
              size="xl"
              className="group shadow-glow hover:shadow-[0_0_50px_rgba(255,107,157,0.4)]"
              asChild
            >
              <Link href="/auth/signup">Start Free Trial</Link>
            </Button>
          )}
          <Button variant="outline" size="xl" className="gap-2" asChild>
            <Link href="#demo">
              <Play className="w-5 h-5" />
              Watch Demo
            </Link>
          </Button>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          onSubmit={submit}
          className="flex flex-col sm:flex-row gap-2 justify-center items-center max-w-md mx-auto mb-10"
        >
          <input
            type="email"
            placeholder="Enter your email for early access"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full sm:max-w-xs h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent transition-all disabled:opacity-60"
            aria-invalid={!!error}
          />
          <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto">
            {loading ? "Joining…" : "Get Early Access"}
          </Button>
          {error && (
            <p className="text-sm text-red-400 w-full text-center sm:text-left" role="alert">
              {error}
            </p>
          )}
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-3 text-text-muted text-sm"
        >
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.05 }}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-pink to-primary-purple border-2 border-background"
              />
            ))}
          </div>
          <span>
            Join <strong className="text-text-primary">10,000+</strong> students
          </span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-full p-2 border border-white/20"
        >
          <ChevronDown className="w-6 h-6 text-text-secondary" />
        </motion.div>
      </motion.div>
    </section>
  );
}
