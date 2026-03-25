"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Lock, Zap, CreditCard } from "lucide-react";
import { useWaitlist } from "@/lib/use-waitlist";
import { useSession } from "next-auth/react";

export function CtaSection() {
  const { email, setEmail, loading, error, submit } = useWaitlist();
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  if (isLoggedIn) {
    return null;
  }

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-pink/20 via-primary-purple/20 to-primary-violet/20" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 lg:p-12 text-center"
        >
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-text-primary mb-4">
            Join 10,000+ Students Studying Smarter
          </h2>
          <p className="text-text-secondary text-lg mb-8">
            Start your 7-day free trial. No credit card required.
          </p>
          <form
            onSubmit={submit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="flex-1 h-14 px-5 rounded-xl bg-white/5 border border-white/10 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent transition-all disabled:opacity-60"
              aria-invalid={!!error}
            />
            <Button type="submit" size="xl" className="sm:w-auto" disabled={loading}>
              {loading ? "Joining…" : "Get Started Free"}
            </Button>
          </form>
          {error && (
            <p className="text-sm text-red-400 mb-2" role="alert">
              {error}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-6 text-text-muted text-sm">
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4" /> Secure
            </span>
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4" /> Instant Access
            </span>
            <span className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> No Credit Card
            </span>
          </div>
          <p className="text-text-muted text-xs mt-6">
            By signing up, you agree to our{" "}
            <a href="/terms" className="text-primary-pink hover:underline">
              Terms
            </a>{" "}
            &{" "}
            <a href="/privacy" className="text-primary-pink hover:underline">
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
