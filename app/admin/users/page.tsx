import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

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
      <div>
        <h1 className="text-3xl font-bold text-white">Users</h1>
        <p className="mt-2 text-gray-400">Manage account roles, plans, trial windows, and activity.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
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
              <tr key={user.id} className="bg-zinc-900/70">
                <td className="px-4 py-3 align-top">
                  <Link href={`/admin/users/${user.id}`} className="font-medium text-white hover:text-pink-300">
                    {user.name || "Unnamed User"}
                  </Link>
                  <p className="text-xs text-gray-400">{user.email}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </td>
                <td className="px-4 py-3 text-gray-300">{user.role}</td>
                <td className="px-4 py-3 text-gray-300">{user.plan}</td>
                <td className="px-4 py-3 text-gray-300">{user.emailVerified ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-gray-300">
                  {user._count.documents} docs • {user._count.notes} notes • {user._count.mcqSets} MCQs •{" "}
                  {user._count.examPapers} exams
                </td>
                <td className="px-4 py-3 text-gray-300">
                  {user.trialEndsAt ? new Date(user.trialEndsAt).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      user.isActive
                        ? "bg-emerald-500/10 text-emerald-300"
                        : "bg-red-500/10 text-red-300"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
