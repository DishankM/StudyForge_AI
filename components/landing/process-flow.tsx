"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, StickyNote, BookOpen, Brain, FileCheck, ListChecks, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const inputTabs = [
  { id: "pdf", label: "PDF", icon: FileText },
  { id: "notes", label: "Notes", icon: StickyNote },
  { id: "syllabus", label: "Syllabus", icon: BookOpen },
];

const outputs = [
  { id: "notes", label: "Short Notes", icon: FileText },
  { id: "mcq", label: "MCQs", icon: ListChecks },
  { id: "viva", label: "Viva Questions", icon: FileCheck },
  { id: "exam", label: "Exam Paper", icon: FileCheck },
  { id: "revision", label: "Revision Plan", icon: Calendar },
];

export function ProcessFlow() {
  const [activeInput, setActiveInput] = useState("pdf");
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  return (
    <section className="bg-surface/30 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center sm:mb-16"
        >
          <h2 className="mb-4 font-heading text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl">
            See StudyForge in Action
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid items-start gap-8 lg:grid-cols-3 lg:gap-12"
        >
          {/* Input */}
          <div className="space-y-4">
            <p className="text-text-muted text-sm font-medium uppercase tracking-wider">
              Input
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:flex lg:flex-col">
              {inputTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveInput(tab.id)}
                  className={cn(
                    "flex min-h-[52px] items-center gap-2 rounded-xl border px-4 py-3 text-left transition-all",
                    activeInput === tab.id
                      ? "border-primary-purple bg-primary-purple/10 text-text-primary"
                      : "border-white/10 hover:border-white/20 text-text-secondary"
                  )}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="glass-card flex min-h-[120px] items-center justify-center p-5 sm:p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeInput}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="text-center text-text-muted"
                >
                  <p className="text-sm">
                    {activeInput === "pdf" && "Upload your PDF document"}
                    {activeInput === "notes" && "Paste or upload notes"}
                    {activeInput === "syllabus" && "Upload syllabus"}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Center - AI Processing */}
          <div className="flex flex-col items-center justify-center py-2 sm:py-8">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-pink to-primary-purple flex items-center justify-center mb-4"
            >
              <Brain className="w-10 h-10 text-white" />
            </motion.div>
            <p className="text-primary-purple font-medium">AI Processing</p>
            <div className="flex gap-1 mt-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary-pink"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Output */}
          <div className="space-y-4">
            <p className="text-text-muted text-sm font-medium uppercase tracking-wider">
              Output
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {outputs.map((out, i) => (
                <motion.div
                  key={out.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card flex items-center gap-3 p-3 transition-colors hover:border-primary-pink/30 cursor-default"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-violet/20 flex items-center justify-center shrink-0">
                    <out.icon className="w-5 h-5 text-primary-purple" />
                  </div>
                  <span className="text-sm font-medium text-text-primary">
                    {out.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 text-center sm:mt-12"
        >
          <Button size="lg" asChild>
            <Link href={isLoggedIn ? "/dashboard" : "/auth/signup"}>Try it yourself</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
