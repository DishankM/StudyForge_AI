"use client";

import { motion } from "framer-motion";
import { Clock, Brain, Zap, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const benefits = [
  {
    title: "Save 15+ Hours Every Week",
    icon: Clock,
    side: "left",
    description:
      "Stop wasting time manually summarizing notes. StudyForge processes 100-page documents in under 2 minutes.",
    quote: "I used to spend entire weekends making notes. Now I'm done in 30 minutes!",
    author: "Priya, Engineering Student",
    stat: "Traditional vs StudyForge",
  },
  {
    title: "Learn Smarter, Not Harder",
    icon: Brain,
    side: "right",
    description:
      "AI identifies exactly what you need to study. Focus on weak areas with intelligent practice questions.",
    pills: ["Adaptive Learning", "Progress Tracking", "Weak Area Detection"],
    stats: ["85% better retention", "2x faster prep"],
  },
  {
    title: "Exam-Ready in Record Time",
    icon: Zap,
    side: "left",
    description:
      "Last-minute preparation made easy. Generate complete study materials from your syllabus 24 hours before exams.",
    timeline: "24hr before exam → Complete study kit ready",
  },
  {
    title: "University-Specific Formatting",
    icon: Building2,
    side: "right",
    description:
      "Practice with papers that look exactly like your university's format. Mumbai University, Delhi University, and 20+ more.",
    cta: "Request your university",
  },
];

export function Benefits() {
  return (
    <section className="py-24 bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-text-primary mb-4">
            Why Students Love StudyForge
          </h2>
        </motion.div>

        <div className="space-y-24">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                benefit.side === "right" ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div
                className={
                  benefit.side === "right" ? "lg:order-2" : "lg:order-1"
                }
              >
                <div className="glass-card p-8 lg:p-12 aspect-video flex items-center justify-center">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-pink/20 to-primary-purple/20 flex items-center justify-center">
                    <benefit.icon className="w-12 h-12 text-primary-purple" />
                  </div>
                </div>
              </div>
              <div
                className={
                  benefit.side === "right" ? "lg:order-1" : "lg:order-2"
                }
              >
                <h3 className="font-heading font-bold text-2xl lg:text-3xl text-text-primary mb-4">
                  {benefit.title}
                </h3>
                <p className="text-text-secondary mb-6">{benefit.description}</p>
                {"quote" in benefit && benefit.quote && (
                  <blockquote className="border-l-4 border-primary-pink pl-4 py-2 mb-6 text-text-secondary italic">
                    &ldquo;{benefit.quote}&rdquo; — {benefit.author}
                  </blockquote>
                )}
                {"pills" in benefit && benefit.pills && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {(benefit.pills as string[]).map((p) => (
                      <span
                        key={p}
                        className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                )}
                {"stats" in benefit && benefit.stats && (
                  <div className="flex gap-4 mb-6">
                    {(benefit.stats as string[]).map((s) => (
                      <span
                        key={s}
                        className="px-4 py-2 rounded-lg bg-primary-purple/10 text-primary-purple font-medium text-sm"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
                {"timeline" in benefit && benefit.timeline && (
                  <p className="text-primary-pink font-medium mb-6">
                    {benefit.timeline}
                  </p>
                )}
                {"cta" in benefit && benefit.cta && (
                  <Button variant="outline" asChild>
                    <Link href="#contact">{benefit.cta}</Link>
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
