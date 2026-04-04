"use client";

import { CreditCard, Lock, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useWaitlist } from "@/lib/use-waitlist";

export function CtaSection() {
  const { email, setEmail, loading, error, submit } = useWaitlist();
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  if (isLoggedIn) {
    return null;
  }

  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-pink/20 via-primary-purple/20 to-primary-violet/20" />
      <div className="absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 text-center lg:p-12"
        >
          <h2 className="mb-4 font-heading text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl">
            Start Building Your Study Workflow
          </h2>
          <p className="mb-8 text-lg text-text-secondary">
            Upload your material, explore the generated outputs, and decide which study format helps you most.
          </p>
          <form onSubmit={submit} className="mx-auto mb-6 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="h-14 flex-1 rounded-xl border border-white/10 bg-white/5 px-5 text-text-primary placeholder:text-text-muted transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-purple disabled:opacity-60"
              aria-invalid={!!error}
            />
            <Button type="submit" size="xl" className="sm:w-auto" disabled={loading}>
              {loading ? "Joining..." : "Get Started Free"}
            </Button>
          </form>
          {error && (
            <p className="mb-2 text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-text-muted">
            <span className="flex items-center gap-2">
              <Lock className="h-4 w-4" /> Secure
            </span>
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4" /> Fast onboarding
            </span>
            <span className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" /> No credit card
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
