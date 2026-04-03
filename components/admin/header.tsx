"use client";

import { Menu, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminHeader({
  onMenuClick,
}: {
  onMenuClick?: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between gap-x-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onMenuClick}
            className="p-2 text-gray-400 hover:text-white lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <p className="text-sm font-semibold text-white">Admin Control Center</p>
            <p className="text-xs text-gray-400">Operational overview for StudyForge</p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-pink-500/20 bg-gradient-to-r from-pink-500/10 to-purple-500/10 px-4 py-2 text-sm text-gray-200 md:flex">
          <ShieldAlert className="h-4 w-4 text-pink-400" />
          Live admin mode
        </div>
      </div>
    </header>
  );
}
