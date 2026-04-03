import { AdminShell } from "@/components/admin/shell";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminUser = await requireAdmin();

  return (
    <AdminShell
      user={{
        name: adminUser.name,
        email: adminUser.email,
        image: adminUser.image,
        role: adminUser.role,
      }}
    >
      {children}
    </AdminShell>
  );
}
