"use client";

import { motion } from "framer-motion";
import {
  FileText,
  ListChecks,
  FileCheck,
  Mic,
  BookOpen,
  Calendar,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Smart Notes Generation",
    icon: FileText,
    description:
      "AI extracts key concepts and creates concise, well-structured notes with headings, bullet points, and highlights",
    benefits: ["70% less reading time", "Better retention", "Organized by topics"],
  },
  {
    title: "Intelligent MCQ Creator",
    icon: ListChecks,
    description:
      "Generate unlimited practice questions with detailed explanations. Choose difficulty level and question types.",
    benefits: ["Practice mode with timer", "Instant feedback", "Performance tracking"],
  },
  {
    title: "University Exam Papers",
    icon: FileCheck,
    description:
      "Create exam papers matching your university's exact format. Choose question distribution, marks allocation, and difficulty.",
    benefits: ["20+ university templates", "Custom mark schemes", "Include answer keys"],
  },
  {
    title: "Viva Question Bank",
    icon: Mic,
    description:
      "Prepare for oral exams with AI-generated viva questions covering all topics in depth.",
    benefits: ["Categorized by topic", "Multiple difficulty levels", "Model answers included"],
  },
  {
    title: "Syllabus-to-Notes",
    icon: BookOpen,
    description:
      "Upload your syllabus and get comprehensive notes covering every topic automatically.",
    benefits: ["Complete coverage", "Structured by units", "Saves 20+ hours"],
  },
  {
    title: "Smart Revision Planner",
    icon: Calendar,
    description:
      "AI creates personalized study schedules based on your exam dates and available time.",
    benefits: ["Day-by-day breakdown", "Progress tracking", "Adaptive scheduling"],
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export function Features() {
  return (
    <section id="features" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-text-primary mb-4">
            Everything You Need to Ace Your Exams
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Comprehensive tools designed for student success
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="glass-card p-6 lg:p-8 group hover:border-primary-purple/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-pink to-primary-purple flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-heading font-semibold text-xl text-text-primary mb-3">
                {feature.title}
              </h3>
              <p className="text-text-secondary text-sm mb-4">
                {feature.description}
              </p>
              <ul className="space-y-1 mb-6">
                {feature.benefits.map((b) => (
                  <li key={b} className="text-text-muted text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-pink" />
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                href="#"
                className="inline-flex items-center gap-2 text-primary-pink text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Learn More <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
