import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import {
  Users,
  FileText,
  BrainCircuit,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  ArrowUpRight,
  Clock3,
} from "lucide-react";

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: typeof Users;
  accent: string;
}) {
  return (
    <div className="group rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition hover:border-white/15 hover:shadow-[0_20px_40px_rgba(0,0,0,0.28)]">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-400">{label}</p>
        <div className={`rounded-2xl border border-white/10 p-2 ${accent}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
      <p className="mt-5 text-3xl font-bold tracking-tight text-white">{value}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-gray-500">Live platform total</p>
    </div>
  );
}

export default async function AdminOverviewPage() {
  const adminUser = await requireAdmin();

  const [
    totalUsers,
    verifiedUsers,
    activeTrials,
    totalDocuments,
    totalNotes,
    totalMcqSets,
    totalExamPapers,
    vivaReadyDocuments,
    recentUsers,
  ] = await prisma.$transaction([
    prisma.user.count(),
    prisma.user.count({ where: { emailVerified: { not: null } } }),
    prisma.user.count({ where: { trialEndsAt: { gt: new Date() } } }),
    prisma.document.count(),
    prisma.note.count(),
    prisma.mcqSet.count(),
    prisma.examPaper.count(),
    prisma.document.count({ where: { vivaGeneratedAt: { not: null } } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
        createdAt: true,
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-gradient-to-r from-pink-500/10 to-purple-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-pink-200">
            <ShieldCheck className="h-3.5 w-3.5" />
            Control Center
          </div>
          <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Admin Overview</h1>
          <p className="mt-3 text-base leading-7 text-gray-400">
            Welcome back, {adminUser.name || adminUser.email}. Here&apos;s the current platform snapshot.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/80 px-5 py-4 text-sm text-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Secure role</p>
          <p className="mt-2 font-semibold text-white">{adminUser.role}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Users" value={totalUsers} icon={Users} accent="bg-gradient-to-br from-pink-500 to-rose-500" />
        <StatCard label="Verified Users" value={verifiedUsers} icon={ShieldCheck} accent="bg-gradient-to-br from-emerald-500 to-teal-500" />
        <StatCard label="Active Trials" value={activeTrials} icon={Sparkles} accent="bg-gradient-to-br from-violet-500 to-fuchsia-500" />
        <StatCard label="Documents" value={totalDocuments} icon={FileText} accent="bg-gradient-to-br from-sky-500 to-cyan-500" />
        <StatCard label="Notes" value={totalNotes} icon={BrainCircuit} accent="bg-gradient-to-br from-indigo-500 to-blue-500" />
        <StatCard label="MCQ Sets" value={totalMcqSets} icon={BrainCircuit} accent="bg-gradient-to-br from-purple-500 to-pink-500" />
        <StatCard label="Exam Papers" value={totalExamPapers} icon={GraduationCap} accent="bg-gradient-to-br from-amber-500 to-orange-500" />
        <StatCard label="Viva Sets" value={vivaReadyDocuments} icon={Sparkles} accent="bg-gradient-to-br from-red-500 to-pink-500" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Recent Users</h2>
              <p className="text-sm text-gray-400">Newest signups and role distribution</p>
            </div>
            <Link href="/admin/users" className="inline-flex items-center gap-1 text-sm font-medium text-pink-400 hover:text-pink-300">
              View all
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="min-w-full divide-y divide-white/10 text-sm">
              <thead className="bg-white/5 text-left text-gray-400">
                <tr>
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Plan</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {recentUsers.map((user) => (
                  <tr key={user.id} className="bg-zinc-900/70 transition hover:bg-white/[0.03]">
                    <td className="px-4 py-4">
                      <Link href={`/admin/users/${user.id}`} className="font-medium text-white hover:text-pink-300">
                        {user.name || "Unnamed User"}
                      </Link>
                      <p className="mt-1 text-xs text-gray-400">{user.email}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-300">
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-gray-200">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-300">
                      <span className="rounded-full border border-pink-500/15 bg-pink-500/10 px-2.5 py-1 text-xs font-medium text-pink-200">
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
          <h2 className="text-xl font-semibold text-white">Quick Access</h2>
          <p className="mt-1 text-sm text-gray-400">Jump straight into the most-used admin areas.</p>
          <div className="mt-6 space-y-3">
            {[
              { href: "/admin/users", title: "User Management", description: "Review roles, plans, and trials." },
              { href: "/admin/content", title: "Content Overview", description: "Inspect uploads and generated material." },
              { href: "/admin/security", title: "Security Feed", description: "Review logins, throttles, and suspicious activity." },
              { href: "/admin/system", title: "System Health", description: "Check service configuration and status." },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group block rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-pink-500/20 hover:bg-white/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-gray-400">{item.description}</p>
                  </div>
                  <ArrowUpRight className="mt-0.5 h-4 w-4 text-gray-500 transition group-hover:text-pink-300" />
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(236,72,153,0.14),transparent_45%),rgba(255,255,255,0.03)] p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <Clock3 className="h-4 w-4 text-pink-300" />
              Daily habit
            </div>
            <p className="mt-2 text-sm leading-6 text-gray-400">
              Check system health before reviewing user reports so support and moderation stay aligned.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
