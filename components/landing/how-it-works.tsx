"use client";

import { motion } from "framer-motion";
import { Upload, Sparkles, GraduationCap } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Upload Your Materials",
    icon: Upload,
    description:
      "Upload PDFs, lecture slides, notes, or even your syllabus. We support all major formats including PDF, DOCX, PPTX, and images.",
    stat: "Processes 100+ pages in seconds",
  },
  {
    number: "02",
    title: "AI Transforms Content",
    icon: Sparkles,
    description:
      "Our advanced AI analyzes your content, identifies key concepts, and structures information for optimal learning and retention.",
    stat: "Powered by Claude AI",
  },
  {
    number: "03",
    title: "Get Exam-Ready Materials",
    icon: GraduationCap,
    description:
      "Receive comprehensive short notes, practice MCQs, viva questions, custom exam papers, and personalized revision plans instantly.",
    stat: "5 output formats instantly",
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
    <section
      id="how-it-works"
      className="relative py-24 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary-violet/5 to-background" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-text-primary mb-4">
            How StudyForge Works
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Your study journey in 3 simple steps
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8 lg:gap-12"
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              variants={item}
              className="relative"
            >
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-px border-t border-dashed border-white/20" />
              )}
              <div className="glass-card p-8 h-full group hover:border-primary-purple/30 transition-all duration-300">
                <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-primary-violet/20 flex items-center justify-center text-primary-purple font-heading font-bold text-sm">
                  {step.number}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-pink to-primary-purple flex items-center justify-center mb-6">
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-xl text-text-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-text-secondary text-sm mb-4">
                  {step.description}
                </p>
                <p className="text-primary-pink text-sm font-medium">
                  {step.stat}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
