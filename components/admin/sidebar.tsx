"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Activity,
  ShieldAlert,
  ShieldCheck,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { logout } from "@/lib/actions/auth";

type AdminUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: "ADMIN" | "SUPER_ADMIN";
};

const navigation = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Content", href: "/admin/content", icon: FolderKanban },
  { name: "Security Feed", href: "/admin/security", icon: ShieldAlert },
  { name: "System", href: "/admin/system", icon: Activity },
];

export function AdminSidebar({
  user,
  mobileOpen = false,
  onClose,
}: {
  user: AdminUser;
  mobileOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-white/10 bg-[#1a1a1a] px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center justify-between">
        <Link href="/admin" className="flex items-center">
          <h1 className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
            StudyForge
          </h1>
        </Link>
        <ShieldCheck className="h-5 w-5 text-pink-400" />
      </div>

      <div className="rounded-xl border border-white/10 bg-gradient-to-br from-pink-500/10 to-purple-500/10 p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-gray-400">Admin Access</span>
          <span className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-2 py-1 text-xs font-semibold text-white">
            {user.role === "SUPER_ADMIN" ? "SUPER" : "ADMIN"}
          </span>
        </div>
        <p className="text-sm text-gray-300">
          Manage users, monitor content, and keep the platform healthy.
        </p>
      </div>

      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={onClose}
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

          <li className="mt-auto space-y-2">
            <Link
              href="/dashboard"
              onClick={onClose}
              className="group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6 text-gray-400 transition-all hover:bg-white/5 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5 shrink-0" />
              Back to App
            </Link>
          </li>
        </ul>
      </nav>

      <div className="flex items-center gap-x-4 border-t border-white/10 py-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.image || ""} />
          <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600">
            {user.name?.[0] || user.email?.[0] || "A"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{user.name || "Admin"}</p>
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
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
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
          <div className="relative z-50 w-72 max-w-[85vw]">{sidebarContent}</div>
        </div>
      </div>
    </>
  );
}
