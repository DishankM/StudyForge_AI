"use client";

import Link from "next/link";
import { Upload, FileText, HelpCircle, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

const actions = [
  {
    title: "Upload Document",
    description: "Upload PDFs, notes, or lectures",
    icon: Upload,
    href: "/dashboard/upload",
    color: "from-pink-500 to-purple-500",
  },
  {
    title: "Generate Notes",
    description: "Create concise study notes",
    icon: FileText,
    href: "/dashboard/upload?action=notes",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Create MCQs",
    description: "Practice with AI-generated questions",
    icon: HelpCircle,
    href: "/dashboard/upload?action=mcqs",
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Exam Paper",
    description: "Generate university-style papers",
    icon: GraduationCap,
    href: "/dashboard/exam-papers/create",
    color: "from-green-500 to-emerald-500",
  },
];

export function QuickActions() {
  return (
    <div className="rounded-[26px] border border-white/10 bg-zinc-950/70 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
          <p className="mt-1 text-sm text-gray-400">Jump into the most common workflows without leaving your dashboard.</p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-gray-400">
          Start Here
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="h-full"
          >
            <Link
              href={action.href}
              className="group relative flex h-full min-h-[180px] flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 p-6 transition-all hover:-translate-y-1 hover:border-white/20"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 transition-opacity group-hover:opacity-15`} />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_55%)]" />

              <div className="relative">
                <div className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br ${action.color} p-3 shadow-lg shadow-black/20`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-1 text-lg font-semibold">{action.title}</h3>
                <p className="text-sm text-gray-400">{action.description}</p>
              </div>
              <div className="relative text-sm font-medium text-white/80 transition group-hover:text-white">
                Open workflow
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
