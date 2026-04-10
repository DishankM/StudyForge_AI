import { Settings2, ShieldCheck } from "lucide-react";
import { SettingsTabs } from "@/components/settings/settings-tabs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950/80 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-6 lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.18),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.14),_transparent_32%)]" />
        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-sm font-medium text-pink-200">
              <Settings2 className="h-4 w-4" />
              Account settings
            </div>
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">Settings</h1>
            <p className="mt-3 text-base text-gray-300">
              Manage your account details, study preferences, notifications, billing, and sensitive actions from one place.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-gray-400">Current plan</p>
              <p className="mt-2 text-xl font-semibold text-white sm:text-2xl">{user?.plan || "FREE"}</p>
              <p className="mt-1 text-sm text-gray-400">Upgrade anytime as your study usage grows.</p>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-emerald-200">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.24em]">Account status</span>
              </div>
              <p className="mt-2 text-sm text-emerald-100/90">
                Your profile and study preferences are available here with the same workspace theme.
              </p>
            </div>
          </div>
        </div>
      </div>

      <SettingsTabs user={user!} />
    </div>
  );
}
