import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { ArrowUpRight, CheckCircle2, ShieldCheck, Sparkles, UserX } from "lucide-react";

function Badge({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "success" | "warning" | "danger" | "accent";
}) {
  const toneClass =
    tone === "success"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
      : tone === "warning"
      ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
      : tone === "danger"
      ? "border-red-500/20 bg-red-500/10 text-red-300"
      : tone === "accent"
      ? "border-pink-500/20 bg-pink-500/10 text-pink-200"
      : "border-white/10 bg-white/5 text-gray-200";

  return <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${toneClass}`}>{children}</span>;
}

export default async function AdminUsersPage() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          documents: true,
          notes: true,
          mcqSets: true,
          examPapers: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-gradient-to-r from-pink-500/10 to-purple-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-pink-200">
            <ShieldCheck className="h-3.5 w-3.5" />
            User Directory
          </div>
          <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Users</h1>
          <p className="mt-3 text-base leading-7 text-gray-400">Manage account roles, plans, trial windows, and activity.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-zinc-900 px-5 py-4">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Verified</p>
            <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-white">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              {users.filter((user) => Boolean(user.emailVerified)).length}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900 px-5 py-4">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Trials Active</p>
            <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-white">
              <Sparkles className="h-4 w-4 text-pink-300" />
              {users.filter((user) => user.trialEndsAt && user.trialEndsAt > new Date()).length}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900 px-5 py-4">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Inactive</p>
            <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-white">
              <UserX className="h-4 w-4 text-red-300" />
              {users.filter((user) => !user.isActive).length}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 md:hidden">
        {users.map((user) => (
          <article key={user.id} className="rounded-3xl border border-white/10 bg-zinc-900 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <Link href={`/admin/users/${user.id}`} className="inline-flex items-center gap-1 font-medium text-white hover:text-pink-300">
                  <span className="truncate">{user.name || "Unnamed User"}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                </Link>
                <p className="mt-1 break-all text-xs text-gray-400">{user.email}</p>
                <p className="mt-1 text-xs text-gray-500">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              <Badge tone={user.isActive ? "success" : "danger"}>{user.isActive ? "Active" : "Inactive"}</Badge>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge tone={user.role === "SUPER_ADMIN" ? "accent" : user.role === "ADMIN" ? "warning" : "default"}>
                {user.role}
              </Badge>
              <Badge tone="accent">{user.plan}</Badge>
              <Badge tone={user.emailVerified ? "success" : "warning"}>
                {user.emailVerified ? "Verified" : "Pending"}
              </Badge>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-300 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Docs</p>
                <p className="mt-1 font-medium text-white">{user._count.documents}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Notes</p>
                <p className="mt-1 font-medium text-white">{user._count.notes}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <p className="text-xs uppercase tracking-[0.16em] text-gray-500">MCQs</p>
                <p className="mt-1 font-medium text-white">{user._count.mcqSets}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Exams</p>
                <p className="mt-1 font-medium text-white">{user._count.examPapers}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 col-span-2 sm:col-span-1">
                <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Trial ends</p>
                <p className="mt-1 font-medium text-white">{user.trialEndsAt ? new Date(user.trialEndsAt).toLocaleDateString() : "-"}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-[0_10px_30px_rgba(0,0,0,0.18)] md:block">
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-sm">
          <thead className="bg-white/5 text-left text-gray-400">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Plan</th>
              <th className="px-4 py-3 font-medium">Verified</th>
              <th className="px-4 py-3 font-medium">Content</th>
              <th className="px-4 py-3 font-medium">Trial Ends</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {users.map((user) => (
              <tr key={user.id} className="bg-zinc-900/70 transition hover:bg-white/[0.03]">
                <td className="px-4 py-4 align-top">
                  <Link href={`/admin/users/${user.id}`} className="inline-flex items-center gap-1 font-medium text-white hover:text-pink-300">
                    {user.name || "Unnamed User"}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                  <p className="mt-1 text-xs text-gray-400">{user.email}</p>
                  <p className="mt-1 text-xs text-gray-500">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="px-4 py-4 text-gray-300">
                  <Badge tone={user.role === "SUPER_ADMIN" ? "accent" : user.role === "ADMIN" ? "warning" : "default"}>
                    {user.role}
                  </Badge>
                </td>
                <td className="px-4 py-4 text-gray-300">
                  <Badge tone="accent">{user.plan}</Badge>
                </td>
                <td className="px-4 py-4 text-gray-300">
                  <Badge tone={user.emailVerified ? "success" : "warning"}>
                    {user.emailVerified ? "Verified" : "Pending"}
                  </Badge>
                </td>
                <td className="px-4 py-4 text-gray-300">
                  {user._count.documents} docs • {user._count.notes} notes • {user._count.mcqSets} MCQs • {user._count.examPapers} exams
                </td>
                <td className="px-4 py-4 text-gray-300">
                  {user.trialEndsAt ? new Date(user.trialEndsAt).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-4">
                  <Badge tone={user.isActive ? "success" : "danger"}>{user.isActive ? "Active" : "Inactive"}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
