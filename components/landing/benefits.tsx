"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, Building2, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  {
    title: "Spend Less Time Rewriting Material",
    icon: Clock,
    side: "left",
    description:
      "Instead of manually restructuring long documents, you can turn them into study-ready formats that are easier to revise and revisit.",
    quote: "It helped me move from scattered notes to something I could actually revise from.",
    author: "Student workflow focus",
    stat: "Better structure for revision sessions",
  },
  {
    title: "Study in Multiple Formats",
    icon: Brain,
    side: "right",
    description:
      "Different exams need different preparation styles. StudyForge helps you switch between notes, MCQs, viva practice, and exam-style output from the same source.",
    pills: ["Notes", "MCQs", "Viva", "Exam Papers"],
    stats: ["One source, multiple outputs", "Useful before tests and finals"],
  },
  {
    title: "Useful for Last-Minute Revision",
    icon: Zap,
    side: "left",
    description:
      "When you are short on time, condensed notes and quick practice sets make revision more manageable than working directly from raw material.",
    timeline: "Upload source -> generate outputs -> start revising",
  },
  {
    title: "Flexible for Different Study Contexts",
    icon: Building2,
    side: "right",
    description:
      "Whether you are revising a chapter, preparing for viva, or building question practice from class material, the workflow stays consistent.",
    cta: "Explore the workflow",
  },
];

export function Benefits() {
  return (
    <section className="bg-surface/30 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 font-heading text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl">
            Why the Workflow Is Useful for Students
          </h2>
        </motion.div>

        <div className="space-y-24">
          {benefits.map((benefit) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid items-center gap-12 lg:grid-cols-2"
            >
              <div className={benefit.side === "right" ? "lg:order-2" : "lg:order-1"}>
                <div className="glass-card flex aspect-video items-center justify-center p-8 lg:p-12">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-pink/20 to-primary-purple/20">
                    <benefit.icon className="h-12 w-12 text-primary-purple" />
                  </div>
                </div>
              </div>
              <div className={benefit.side === "right" ? "lg:order-1" : "lg:order-2"}>
                <h3 className="mb-4 font-heading text-2xl font-bold text-text-primary lg:text-3xl">
                  {benefit.title}
                </h3>
                <p className="mb-6 text-text-secondary">{benefit.description}</p>
                {"quote" in benefit && benefit.quote && (
                  <blockquote className="mb-6 border-l-4 border-primary-pink py-2 pl-4 italic text-text-secondary">
                    &ldquo;{benefit.quote}&rdquo; - {benefit.author}
                  </blockquote>
                )}
                {"pills" in benefit && benefit.pills && (
                  <div className="mb-6 flex flex-wrap gap-2">
                    {(benefit.pills as string[]).map((pill) => (
                      <span
                        key={pill}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm"
                      >
                        {pill}
                      </span>
                    ))}
                  </div>
                )}
                {"stats" in benefit && benefit.stats && (
                  <div className="mb-6 flex gap-4">
                    {(benefit.stats as string[]).map((stat) => (
                      <span
                        key={stat}
                        className="rounded-lg bg-primary-purple/10 px-4 py-2 text-sm font-medium text-primary-purple"
                      >
                        {stat}
                      </span>
                    ))}
                  </div>
                )}
                {"timeline" in benefit && benefit.timeline && (
                  <p className="mb-6 font-medium text-primary-pink">{benefit.timeline}</p>
                )}
                {"cta" in benefit && benefit.cta && (
                  <Button variant="outline" asChild>
                    <Link href="#how-it-works">{benefit.cta}</Link>
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
