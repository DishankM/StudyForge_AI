"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { cn } from "@/lib/utils";

type ShellUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: "USER" | "ADMIN" | "SUPER_ADMIN";
  plan?: "FREE" | "STUDENT_PRO" | "INSTITUTE";
  usage?: {
    uploads: number;
    notes: number;
    mcqs: number;
    viva: number;
    examPapers: number;
    roadmaps: number;
  };
};

export function DashboardShell({
  user,
  children,
}: {
  user: ShellUser;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);

  useEffect(() => {
    const storedValue = window.localStorage.getItem("studyforge-dashboard-sidebar");
    if (storedValue === "closed") {
      setDesktopOpen(false);
    }
  }, []);

  const handleDesktopToggle = () => {
    setDesktopOpen((current) => {
      const next = !current;
      window.localStorage.setItem(
        "studyforge-dashboard-sidebar",
        next ? "open" : "closed"
      );
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <DashboardSidebar
        user={user}
        mobileOpen={mobileOpen}
        desktopOpen={desktopOpen}
        onClose={() => setMobileOpen(false)}
      />
      <div
        className={cn(
          "transition-[padding] duration-300 ease-out",
          desktopOpen ? "lg:pl-[18.5rem]" : "lg:pl-0"
        )}
      >
        <DashboardHeader
          user={user}
          desktopSidebarOpen={desktopOpen}
          onMenuClick={() => setMobileOpen(true)}
          onDesktopSidebarToggle={handleDesktopToggle}
        />
        <main className="scrollbar-hidden px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
