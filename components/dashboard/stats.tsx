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
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative flex h-full min-h-[150px] flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-zinc-900 p-6 transition-all hover:border-white/20"
        >
          <div className={`absolute right-0 top-0 h-20 w-20 bg-gradient-to-br ${stat.color} opacity-10 blur-2xl`} />

          <div className="relative">
            <div className="flex items-center justify-between">
              <div className={`rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-10 p-2`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>

            <div className="mt-4">
              <p className="text-3xl font-bold">
                {values[index]}
              </p>
              <p className="mt-1 text-sm text-gray-400">{stat.name}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
