import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { AdminUserManagementForm } from "@/components/admin/user-management-form";

export default async function AdminUserDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const adminUser = await requireAdmin();

  const [currentAdmin, user, vivaCount] = await prisma.$transaction([
    prisma.user.findUnique({
      where: { id: adminUser.id },
      select: { role: true },
    }),
    prisma.user.findUnique({
      where: { id: params.id },
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
    }),
    prisma.document.count({
      where: {
        userId: params.id,
        vivaGeneratedAt: { not: null },
      },
    }),
  ]);

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">{user.name || "Unnamed User"}</h1>
        <p className="mt-2 text-gray-400">{user.email}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "Documents", value: user._count.documents },
          { label: "Notes", value: user._count.notes },
          { label: "MCQ Sets", value: user._count.mcqSets },
          { label: "Exam Papers", value: user._count.examPapers },
          { label: "Viva Sets", value: vivaCount },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-zinc-900 p-5">
            <p className="text-sm text-gray-400">{item.label}</p>
            <p className="mt-3 text-3xl font-bold text-white">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <AdminUserManagementForm
            user={{
              id: user.id,
              role: user.role,
              plan: user.plan,
              isActive: user.isActive,
              trialEndsAt: user.trialEndsAt,
            }}
            currentAdminRole={currentAdmin?.role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "ADMIN"}
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
          <h2 className="text-xl font-semibold text-white">Profile Snapshot</h2>
          <div className="mt-6 space-y-4 text-sm">
            <div>
              <p className="text-gray-400">Role</p>
              <p className="mt-1 text-white">{user.role}</p>
            </div>
            <div>
              <p className="text-gray-400">Plan</p>
              <p className="mt-1 text-white">{user.plan}</p>
            </div>
            <div>
              <p className="text-gray-400">Email Verified</p>
              <p className="mt-1 text-white">{user.emailVerified ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="text-gray-400">Joined</p>
              <p className="mt-1 text-white">{new Date(user.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400">Trial Ends</p>
              <p className="mt-1 text-white">
                {user.trialEndsAt ? new Date(user.trialEndsAt).toLocaleString() : "—"}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Account Status</p>
              <p className="mt-1 text-white">{user.isActive ? "Active" : "Inactive"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
