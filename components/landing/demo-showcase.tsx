"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, FileCheck, FileText, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "notes", label: "Notes Sample", icon: FileText },
  { id: "mcq", label: "MCQ Sample", icon: ListChecks },
  { id: "exam", label: "Exam Paper Sample", icon: FileCheck },
];

const samples = {
  notes: {
    input: "Biology chapter on cell structure",
    output: (
      <div className="space-y-3 text-left text-sm">
        <h4 className="font-semibold text-primary-pink">1. Cell Structure Overview</h4>
        <ul className="list-inside list-disc space-y-1 text-text-secondary">
          <li>Cell membrane acts as the protective boundary of the cell.</li>
          <li>Nucleus stores genetic material and controls major cell functions.</li>
          <li>Mitochondria are linked to energy production and ATP generation.</li>
        </ul>
        <h4 className="font-semibold text-primary-pink">2. Revision Focus</h4>
        <p className="text-text-secondary">
          Compare organelle roles, structural differences, and the core function of each part.
        </p>
      </div>
    ),
  },
  mcq: {
    input: "Thermodynamics topic for practice revision",
    output: (
      <div className="space-y-3 text-left text-sm">
        <p className="font-medium text-text-primary">Q. What does the first law of thermodynamics describe?</p>
        <div className="space-y-2">
          {[
            "Conservation of energy",
            "Increase in entropy",
            "Heat transfer from cold to hot",
            "Equilibrium of matter",
          ].map((option, index) => (
            <div key={option} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              {String.fromCharCode(65 + index)}. {option}
            </div>
          ))}
        </div>
        <p className="text-xs text-primary-purple">Includes answer explanation and topic context</p>
      </div>
    ),
  },
  exam: {
    input: "University-style paper from uploaded source material",
    output: (
      <div className="space-y-2 rounded-lg border border-white/10 p-4 text-left text-sm">
        <p className="text-center font-heading font-semibold text-text-primary">Semester IV - Subject Name</p>
        <p className="text-center text-xs text-text-muted">Time: 2 hours | Marks: 60</p>
        <p className="text-text-secondary">Section A: Short answer questions</p>
        <p className="text-text-secondary">Section B: Medium length questions</p>
        <p className="text-text-secondary">Section C: Long-form answer questions</p>
      </div>
    ),
  },
};

export function DemoShowcase() {
  const [activeTab, setActiveTab] = useState("notes");

  return (
    <section id="demo" className="py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 font-heading text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl">
            Preview the Output Style
          </h2>
          <p className="text-lg text-text-secondary">
            A quick look at the kind of structured material StudyForge can generate from study sources.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 flex flex-wrap justify-center gap-2"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-5 py-2.5 transition-all",
                activeTab === tab.id
                  ? "border-primary-purple bg-primary-purple/10 text-text-primary"
                  : "border-white/10 text-text-secondary hover:border-white/20"
              )}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="glass-card p-6 lg:p-8"
        >
          <div className="grid items-center gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 opacity-80">
              <p className="mb-2 text-xs text-text-muted">Input</p>
              <p className="text-sm text-text-secondary">
                {samples[activeTab as keyof typeof samples].input}
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <ArrowRight className="h-8 w-8 text-primary-purple" />
              <span className="text-xs font-medium text-primary-purple">Document to study output</span>
            </div>
            <div className="min-h-[160px] rounded-xl border border-primary-purple/20 bg-white/5 p-4">
              <p className="mb-2 text-xs text-text-muted">Output</p>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  {samples[activeTab as keyof typeof samples].output}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <Button size="xl" asChild>
            <Link href="/auth/signup">Try it Free</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
