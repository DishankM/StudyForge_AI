"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/header";

type AdminShellUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: "ADMIN" | "SUPER_ADMIN";
};

export function AdminShell({
  user,
  children,
}: {
  user: AdminShellUser;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <AdminSidebar user={user} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="lg:pl-72">
        <AdminHeader onMenuClick={() => setMobileOpen(true)} />
        <main className="px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
