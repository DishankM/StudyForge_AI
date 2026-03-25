"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ListChecks, FileCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "notes", label: "Notes Sample", icon: FileText },
  { id: "mcq", label: "MCQ Sample", icon: ListChecks },
  { id: "exam", label: "Exam Paper Sample", icon: FileCheck },
];

const samples = {
  notes: {
    input: "Chapter 3: Cell Biology – 15 pages",
    output: (
      <div className="text-left space-y-3 text-sm">
        <h4 className="font-semibold text-primary-pink">3.1 Cell Structure</h4>
        <ul className="list-disc list-inside text-text-secondary space-y-1">
          <li>Cell membrane: phospholipid bilayer</li>
          <li>Nucleus: contains genetic material</li>
          <li>Mitochondria: energy production (ATP)</li>
        </ul>
        <h4 className="font-semibold text-primary-pink">3.2 Key Concepts</h4>
        <p className="text-text-secondary">
          Prokaryotic vs eukaryotic cells; organelle functions...
        </p>
      </div>
    ),
  },
  mcq: {
    input: "Topic: Thermodynamics",
    output: (
      <div className="text-left space-y-3 text-sm">
        <p className="text-text-primary font-medium">
          Q. First law of thermodynamics states:
        </p>
        <div className="space-y-2">
          {["Energy cannot be created or destroyed", "Entropy always increases", "Heat flows from cold to hot", "None of the above"].map((opt, i) => (
            <div
              key={i}
              className="px-3 py-2 rounded-lg border border-white/10 bg-white/5"
            >
              {String.fromCharCode(65 + i)}. {opt}
            </div>
          ))}
        </div>
        <p className="text-primary-purple text-xs">✓ Detailed explanation included</p>
      </div>
    ),
  },
  exam: {
    input: "Format: Mumbai University B.Sc.",
    output: (
      <div className="text-left space-y-2 text-sm border border-white/10 rounded-lg p-4">
        <p className="text-center font-heading font-semibold text-text-primary">
          Semester IV — Subject Name
        </p>
        <p className="text-center text-text-muted text-xs">Marks: 60 | Time: 2 hrs</p>
        <p className="text-text-secondary">Section A: 10 × 2 = 20 marks</p>
        <p className="text-text-secondary">Section B: 5 × 5 = 25 marks</p>
        <p className="text-text-secondary">Section C: 3 × 5 = 15 marks</p>
      </div>
    ),
  },
};

export function DemoShowcase() {
  const [activeTab, setActiveTab] = useState("notes");

  return (
    <section id="demo" className="py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-text-primary mb-4">
            See the Quality Yourself
          </h2>
          <p className="text-text-secondary text-lg">
            Real outputs from StudyForge AI
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all",
                activeTab === tab.id
                  ? "border-primary-purple bg-primary-purple/10 text-text-primary"
                  : "border-white/10 hover:border-white/20 text-text-secondary"
              )}
            >
              <tab.icon className="w-5 h-5" />
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
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 opacity-80">
              <p className="text-text-muted text-xs mb-2">Input</p>
              <p className="text-text-secondary text-sm">
                {samples[activeTab as keyof typeof samples].input}
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <ArrowRight className="w-8 h-8 text-primary-purple" />
              <span className="text-xs text-primary-purple font-medium">
                AI Processing
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-primary-purple/20 min-h-[160px]">
              <p className="text-text-muted text-xs mb-2">Output</p>
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
          className="text-center mt-10"
        >
          <Button size="xl" asChild>
            <Link href="/auth/signup">Try it Free</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
