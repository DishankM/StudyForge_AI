import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserUsageSnapshot } from "@/lib/plan-enforcement";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/shell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  const [user, usageSnapshot] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        image: true,
        role: true,
        plan: true,
      },
    }),
    getUserUsageSnapshot(session.user.id),
  ]);

  return (
    <DashboardShell
      user={{
        name: user?.name ?? session.user.name,
        email: user?.email ?? session.user.email,
        image: user?.image ?? session.user.image,
        role: user?.role ?? session.user.role,
        plan: user?.plan ?? "FREE",
        usage: usageSnapshot.usage,
      }}
    >
      {children}
    </DashboardShell>
  );
}
