"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getPlanDetails, getUsageProgress, normalizePlan } from "@/lib/plans";
import {
  Home,
  Upload,
  FileText,
  HelpCircle,
  FileEdit,
  Calendar,
  Settings,
  LogOut,
  Sparkles,
  GraduationCap,
  ShieldCheck,
  PanelLeftClose,
  Crown,
} from "lucide-react";
import { logout } from "@/lib/actions/auth";

type SidebarUser = {
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

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Upload", href: "/dashboard/upload", icon: Upload },
  { name: "Documents", href: "/dashboard/documents", icon: FileText },
  { name: "Notes", href: "/dashboard/notes", icon: FileEdit },
  { name: "MCQs", href: "/dashboard/mcqs", icon: HelpCircle },
  { name: "Exam Papers", href: "/dashboard/exam-papers", icon: GraduationCap },
  { name: "Viva Questions", href: "/dashboard/viva", icon: Sparkles },
  { name: "Exam Roadmap", href: "/dashboard/revision", icon: Calendar },
];

export function DashboardSidebar({
  user,
  mobileOpen = false,
  desktopOpen = true,
  onClose,
}: {
  user: SidebarUser;
  mobileOpen?: boolean;
  desktopOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const plan = getPlanDetails(normalizePlan(user.plan));
  const uploadsUsed = user.usage?.uploads ?? 0;
  const uploadLimit = plan.limits.uploads;
  const uploadProgress = getUsageProgress(uploadsUsed, uploadLimit);
  const isProPlan = plan.id !== "FREE";

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  const sidebarContent = (
    <div className="scrollbar-hidden flex grow flex-col gap-y-5 overflow-y-auto border-r border-white/10 bg-[#171717] px-4 pb-4 sm:px-5">
      <div className="flex h-16 shrink-0 items-center">
        <Link href="/" className="flex items-center" onClick={handleNavClick}>
          <h1 className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-[1.35rem] font-bold tracking-tight text-transparent">
            StudyForge
          </h1>
        </Link>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.18),_transparent_34%),linear-gradient(135deg,rgba(24,24,27,0.96),rgba(9,9,11,0.98))] p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.24)]">
        <div className="flex items-center gap-2">
          {isProPlan ? <Crown className="h-4 w-4 shrink-0 text-amber-300" /> : null}
          <h2 className="text-base font-semibold leading-none text-white">{isProPlan ? "PRO" : "FREE"}</h2>
        </div>

        <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3">
          <div className="mb-2 flex items-center justify-between gap-3 text-xs">
            <span className="text-gray-400">Uploads</span>
            <span className="shrink-0 font-semibold text-white">
              {uploadLimit === null ? `${uploadsUsed} used` : `${uploadsUsed} / ${uploadLimit}`}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-zinc-800">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] leading-5 text-gray-500">
            {isProPlan ? "Higher limits and premium tools unlocked." : "3 uploads per month on Free plan."}
          </p>
        </div>

        <Link
          href="/dashboard/settings?tab=billing"
          onClick={handleNavClick}
          className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-violet-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:from-pink-400 hover:to-violet-500"
        >
          {isProPlan ? "Manage Plan" : "Upgrade to Pro"}
        </Link>
      </div>

      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={handleNavClick}
                      className={cn(
                        isActive
                          ? "border-l-2 border-pink-500 bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-white"
                          : "text-gray-400 hover:bg-white/5 hover:text-white",
                        "group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6 transition-all"
                      )}
                    >
                      <item.icon
                        className={cn(
                          isActive ? "text-pink-500" : "text-gray-400 group-hover:text-white",
                          "h-5 w-5 shrink-0"
                        )}
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>

          <li className="mt-auto">
            {(user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
              <Link
                href="/admin"
                onClick={handleNavClick}
                className="group mb-1 flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6 text-gray-400 transition-all hover:bg-white/5 hover:text-white"
              >
                <ShieldCheck className="h-5 w-5 shrink-0" />
                Admin Panel
              </Link>
            )}
            <Link
              href="/dashboard/settings"
              onClick={handleNavClick}
              className="group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6 text-gray-400 transition-all hover:bg-white/5 hover:text-white"
            >
              <Settings className="h-5 w-5 shrink-0" />
              Settings
            </Link>
          </li>
        </ul>
      </nav>

      <div className="flex items-center gap-x-4 border-t border-white/10 py-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.image || ""} />
          <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600">
            {user.name?.[0] || user.email?.[0] || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{user.name || "User"}</p>
          <p className="truncate text-xs text-gray-400">{user.email}</p>
        </div>
        <button
          onClick={() => logout()}
          className="text-gray-400 transition-colors hover:text-white"
          aria-label="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div
        className={cn(
          "hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-[18.5rem] lg:flex-col lg:transition-all lg:duration-300 lg:ease-out",
          desktopOpen
            ? "lg:translate-x-0 lg:opacity-100"
            : "lg:-translate-x-[calc(100%+2px)] lg:opacity-0 lg:pointer-events-none"
        )}
      >
        {sidebarContent}
      </div>

      <div className={cn("lg:hidden", mobileOpen ? "block" : "hidden")}>
        <div className="fixed inset-0 z-50 flex">
          <button
            type="button"
            onClick={onClose}
            className="fixed inset-0 bg-black/60"
            aria-label="Close sidebar"
          />
          <div className="relative z-50 w-[18rem] max-w-[88vw]">
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-black/40 p-2 text-gray-300 transition hover:text-white"
              aria-label="Close sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
            {sidebarContent}
          </div>
        </div>
      </div>
    </>
  );
}
