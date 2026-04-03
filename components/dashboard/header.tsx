"use client";

import { Bell, Search, Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { signOut } from "next-auth/react";

type HeaderUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: "USER" | "ADMIN" | "SUPER_ADMIN";
};

export function DashboardHeader({
  user,
  onMenuClick,
}: {
  user: HeaderUser;
  onMenuClick?: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-sm">
      <div className="flex h-16 items-center gap-x-4 px-4 sm:gap-x-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          className="-m-2.5 p-2.5 text-gray-400 hover:text-white lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <form className="flex w-full max-w-2xl items-center gap-2" action="#" method="GET">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-400" />
                <span className="hidden text-xs text-gray-500 md:inline">Search</span>
              </div>
              <Input
                type="search"
                placeholder="Search documents, notes, MCQs..."
                className="h-11 w-full rounded-full border-white/10 bg-gradient-to-r from-zinc-900 to-zinc-950 pl-16 pr-28 text-sm text-gray-200 placeholder:text-gray-500 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] transition-all focus:border-pink-500/50 focus:shadow-[0_0_0_1px_rgba(236,72,153,0.3),0_0_30px_rgba(236,72,153,0.15)]"
              />
              <div className="pointer-events-none absolute inset-y-0 right-3 hidden items-center gap-2 text-xs text-gray-500 md:flex">
                <Sparkles className="h-3.5 w-3.5 text-pink-400" />
                Ask StudyForge
              </div>
            </div>
            <Button
              type="submit"
              className="hidden h-11 items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-5 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 transition hover:from-pink-400 hover:to-purple-500 md:inline-flex"
            >
              Search
            </Button>
          </form>
        </div>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button type="button" className="relative -m-2.5 p-2.5 text-gray-400 hover:text-white">
            <Bell className="h-6 w-6" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-pink-500" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.image || ""} />
                  <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600">
                    {user.name?.[0] || user.email?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border-white/10 bg-zinc-900">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">Billing</Link>
              </DropdownMenuItem>
              {(user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
                <DropdownMenuItem asChild>
                  <Link href="/admin">Admin Panel</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
                className="text-red-400 focus:text-red-300"
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
