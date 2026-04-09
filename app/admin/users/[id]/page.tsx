import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { AdminUserManagementForm } from "@/components/admin/user-management-form";
import {
  BadgeCheck,
  CalendarDays,
  FileText,
  GraduationCap,
  HelpCircle,
  Mail,
  ShieldCheck,
  Sparkles,
  UserCircle2,
} from "lucide-react";

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: typeof FileText;
  accent: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-900 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-400">{label}</p>
        <div className={`rounded-2xl border border-white/10 p-2 ${accent}`}>
          <Icon className="h-4.5 w-4.5 text-white" />
        </div>
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-white">{value}</p>
    </div>
  );
}

function ProfileBadge({
  label,
  tone = "default",
}: {
  label: string;
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

  return <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${toneClass}`}>{label}</span>;
}

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
      <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(236,72,153,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(147,51,234,0.16),transparent_28%),rgba(24,24,27,0.92)] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.3)] sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="w-fit rounded-3xl border border-white/10 bg-white/5 p-4">
              <UserCircle2 className="h-12 w-12 text-pink-300 sm:h-14 sm:w-14" />
            </div>
            <div className="min-w-0 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gray-300">
                <ShieldCheck className="h-3.5 w-3.5 text-pink-300" />
                User Profile
              </div>
              <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">{user.name || "Unnamed User"}</h1>
              <p className="mt-3 flex items-start gap-2 text-base text-gray-300">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <span className="break-all">{user.email}</span>
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <ProfileBadge label={user.role} tone={user.role === "SUPER_ADMIN" ? "accent" : user.role === "ADMIN" ? "warning" : "default"} />
                <ProfileBadge label={user.plan} tone="accent" />
                <ProfileBadge label={user.emailVerified ? "Verified" : "Verification Pending"} tone={user.emailVerified ? "success" : "warning"} />
                <ProfileBadge label={user.isActive ? "Active" : "Inactive"} tone={user.isActive ? "success" : "danger"} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Managed by</p>
            <p className="mt-2 text-sm font-semibold text-white">{currentAdmin?.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-5">
        <StatCard label="Documents" value={user._count.documents} icon={FileText} accent="bg-gradient-to-br from-sky-500 to-cyan-500" />
        <StatCard label="Notes" value={user._count.notes} icon={BadgeCheck} accent="bg-gradient-to-br from-indigo-500 to-blue-500" />
        <StatCard label="MCQ Sets" value={user._count.mcqSets} icon={HelpCircle} accent="bg-gradient-to-br from-purple-500 to-pink-500" />
        <StatCard label="Exam Papers" value={user._count.examPapers} icon={GraduationCap} accent="bg-gradient-to-br from-amber-500 to-orange-500" />
        <StatCard label="Viva Sets" value={vivaCount} icon={Sparkles} accent="bg-gradient-to-br from-red-500 to-pink-500" />
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

        <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
          <h2 className="text-xl font-semibold text-white">Profile Snapshot</h2>
          <p className="mt-1 text-sm text-gray-400">Quick operational details for support and access review.</p>

          <div className="mt-6 space-y-4 text-sm">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="flex items-center gap-2 text-gray-400">
                <ShieldCheck className="h-4 w-4 text-pink-300" />
                Role
              </p>
              <p className="mt-2 font-medium text-white">{user.role}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="flex items-center gap-2 text-gray-400">
                <Sparkles className="h-4 w-4 text-pink-300" />
                Plan
              </p>
              <p className="mt-2 font-medium text-white">{user.plan}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="flex items-center gap-2 text-gray-400">
                <BadgeCheck className="h-4 w-4 text-pink-300" />
                Email Verified
              </p>
              <p className="mt-2 font-medium text-white">{user.emailVerified ? "Yes" : "No"}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="flex items-center gap-2 text-gray-400">
                <CalendarDays className="h-4 w-4 text-pink-300" />
                Joined
              </p>
              <p className="mt-2 font-medium text-white">{new Date(user.createdAt).toLocaleString()}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="flex items-center gap-2 text-gray-400">
                <CalendarDays className="h-4 w-4 text-pink-300" />
                Trial Ends
              </p>
              <p className="mt-2 font-medium text-white">
                {user.trialEndsAt ? new Date(user.trialEndsAt).toLocaleString() : "—"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="flex items-center gap-2 text-gray-400">
                <ShieldCheck className="h-4 w-4 text-pink-300" />
                Account Status
              </p>
              <p className="mt-2 font-medium text-white">{user.isActive ? "Active" : "Inactive"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
