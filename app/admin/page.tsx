import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { Users, FileText, BrainCircuit, GraduationCap, Sparkles, ShieldCheck } from "lucide-react";

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: typeof Users;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{label}</p>
        <Icon className="h-5 w-5 text-pink-400" />
      </div>
      <p className="mt-4 text-3xl font-bold text-white">{value}</p>
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
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Overview</h1>
          <p className="mt-2 text-gray-400">
            Welcome back, {adminUser.name || adminUser.email}. Here&apos;s the current platform snapshot.
          </p>
        </div>
        <div className="rounded-full border border-pink-500/20 bg-gradient-to-r from-pink-500/10 to-purple-500/10 px-4 py-2 text-sm text-gray-200">
          Secure role: {adminUser.role}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Users" value={totalUsers} icon={Users} />
        <StatCard label="Verified Users" value={verifiedUsers} icon={ShieldCheck} />
        <StatCard label="Active Trials" value={activeTrials} icon={Sparkles} />
        <StatCard label="Documents" value={totalDocuments} icon={FileText} />
        <StatCard label="Notes" value={totalNotes} icon={BrainCircuit} />
        <StatCard label="MCQ Sets" value={totalMcqSets} icon={BrainCircuit} />
        <StatCard label="Exam Papers" value={totalExamPapers} icon={GraduationCap} />
        <StatCard label="Viva Sets" value={vivaReadyDocuments} icon={Sparkles} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-2xl border border-white/10 bg-zinc-900 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Recent Users</h2>
              <p className="text-sm text-gray-400">Newest signups and role distribution</p>
            </div>
            <Link href="/admin/users" className="text-sm font-medium text-pink-400 hover:text-pink-300">
              View all
            </Link>
          </div>

          <div className="overflow-hidden rounded-xl border border-white/10">
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
                  <tr key={user.id} className="bg-zinc-900/70">
                    <td className="px-4 py-3">
                      <Link href={`/admin/users/${user.id}`} className="font-medium text-white hover:text-pink-300">
                        {user.name || "Unnamed User"}
                      </Link>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{user.role}</td>
                    <td className="px-4 py-3 text-gray-300">{user.plan}</td>
                    <td className="px-4 py-3 text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
          <h2 className="text-xl font-semibold text-white">Quick Access</h2>
          <p className="mt-1 text-sm text-gray-400">Jump straight into the most-used admin areas.</p>
          <div className="mt-6 space-y-3">
            {[
              { href: "/admin/users", title: "User Management", description: "Review roles, plans, and trials." },
              { href: "/admin/content", title: "Content Overview", description: "Inspect uploads and generated material." },
              { href: "/admin/system", title: "System Health", description: "Check service configuration and status." },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-pink-500/20 hover:bg-white/10"
              >
                <p className="font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-sm text-gray-400">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
