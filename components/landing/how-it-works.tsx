"use client";

import { motion } from "framer-motion";
import { GraduationCap, Sparkles, Upload } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Upload Your Material",
    icon: Upload,
    description:
      "Upload study sources like PDFs, notes, lecture slides, syllabus files, or image-based material.",
    stat: "Supports common study document formats",
  },
  {
    number: "02",
    title: "Extract and Structure Content",
    icon: Sparkles,
    description:
      "StudyForge extracts the usable content, organizes it, and prepares it for notes, MCQs, viva prompts, and exam-style output.",
    stat: "Designed for document-to-study workflows",
  },
  {
    number: "03",
    title: "Revise with Generated Outputs",
    icon: GraduationCap,
    description:
      "Open your generated assets in the dashboard, practice MCQs, review viva questions, and build exam-focused preparation from one place.",
    stat: "Built for revision, practice, and exam prep",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary-violet/5 to-background" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 font-heading text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl">
            How StudyForge Works
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-text-secondary">
            A simple flow for turning raw study material into usable preparation assets.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-8 md:grid-cols-3 lg:gap-12"
        >
          {steps.map((step, index) => (
            <motion.div key={step.number} variants={item} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute left-[60%] top-16 hidden h-px w-[80%] border-t border-dashed border-white/20 md:block" />
              )}
              <div className="glass-card group h-full p-8 transition-all duration-300 hover:border-primary-purple/30">
                <div className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary-violet/20 text-sm font-bold text-primary-purple">
                  {step.number}
                </div>
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-pink to-primary-purple">
                  <step.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-3 font-heading text-xl font-semibold text-text-primary">
                  {step.title}
                </h3>
                <p className="mb-4 text-sm text-text-secondary">{step.description}</p>
                <p className="text-sm font-medium text-primary-pink">{step.stat}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
