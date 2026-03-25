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
    <div>
      <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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
              className="group relative flex h-full min-h-[170px] flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-zinc-900 p-6 transition-all hover:border-white/20"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 transition-opacity group-hover:opacity-10`} />

              <div className="relative">
                <div className={`mb-4 inline-flex rounded-lg bg-gradient-to-br ${action.color} p-3`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-1 text-lg font-semibold">{action.title}</h3>
                <p className="text-sm text-gray-400">{action.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
