"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

type ShellUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export function DashboardShell({
  user,
  children,
}: {
  user: ShellUser;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <DashboardSidebar
        user={user}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <div className="lg:pl-72">
        <DashboardHeader user={user} onMenuClick={() => setMobileOpen(true)} />
        <main className="px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
