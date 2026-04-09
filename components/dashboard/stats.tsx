"use client";

import { FileText, HelpCircle, GraduationCap, StickyNote } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    name: "Documents",
    icon: FileText,
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Notes",
    icon: StickyNote,
    color: "from-pink-500 to-purple-500",
  },
  {
    name: "MCQs",
    icon: HelpCircle,
    color: "from-orange-500 to-red-500",
  },
  {
    name: "Exam Papers",
    icon: GraduationCap,
    color: "from-green-500 to-emerald-500",
  },
];

export function DashboardStats({
  documents,
  notes,
  mcqs,
  examPapers,
}: {
  documents: number;
  notes: number;
  mcqs: number;
  examPapers: number;
}) {
  const values = [documents, notes, mcqs, examPapers];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative flex h-full min-h-[170px] flex-col justify-between overflow-hidden rounded-[24px] border border-white/10 bg-zinc-950/80 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.24)] transition-all hover:-translate-y-1 hover:border-white/20"
        >
          <div className={`absolute right-0 top-0 h-24 w-24 bg-gradient-to-br ${stat.color} opacity-15 blur-3xl`} />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_55%)]" />

          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className={`rounded-2xl bg-gradient-to-br ${stat.color} p-3 shadow-lg shadow-black/20`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-gray-400">
                Live
              </span>
            </div>

            <div className="mt-4">
              <p className="text-sm uppercase tracking-[0.24em] text-gray-400">{stat.name}</p>
              <p className="mt-3 text-4xl font-semibold tracking-tight text-white">{values[index]}</p>
              <p className="mt-2 text-sm text-gray-500">Available in your workspace right now</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
