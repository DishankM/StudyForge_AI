"use client";

import Link from "next/link";
import { Upload, FileText, HelpCircle, GraduationCap, Map } from "lucide-react";
import { motion } from "framer-motion";

const actions = [
  {
    title: "Upload Document",
    description: "Start here: upload PDFs, notes, or lecture slides",
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
  {
    title: "Exam Roadmap",
    description: "AI plan with phases and daily tasks",
    icon: Map,
    href: "/dashboard/revision/new",
    color: "from-violet-500 to-fuchsia-500",
  },
];

export function QuickActions() {
  return (
    <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015)),rgba(9,9,11,0.86)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white sm:text-xl">Quick Actions</h2>
          <p className="mt-1 text-sm text-gray-400">Jump into the most common workflows without leaving your dashboard.</p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-gray-400">
          Start Here
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
              className="group relative flex h-full min-h-[180px] flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.01)),rgba(24,24,27,0.88)] p-6 transition-all hover:-translate-y-1 hover:border-white/20"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 transition-opacity group-hover:opacity-15`} />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_55%)]" />

              <div className="relative">
                {index === 0 && (
                  <span className="mb-3 inline-flex rounded-full border border-pink-500/30 bg-pink-500/20 px-2.5 py-1 text-xs font-medium text-pink-100">
                    Recommended
                  </span>
                )}
                <div className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br ${action.color} p-3 shadow-lg shadow-black/20`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-1 text-base font-semibold sm:text-lg">{action.title}</h3>
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
