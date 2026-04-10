"use client";

import { BellRing, MailOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function NotificationSettings({ user }: { user: any }) {
  return (
    <Card className="overflow-hidden rounded-[26px] border-white/10 bg-zinc-950/80 shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
      <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.16),_transparent_35%)] p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-white sm:text-xl">Notifications</h2>
        <p className="mt-2 text-sm text-gray-400">Control which updates and reminders reach you.</p>
      </div>

      <div className="space-y-5 p-5 sm:space-y-6 sm:p-6">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-4 flex items-center gap-2 text-white">
            <MailOpen className="h-4 w-4 text-emerald-300" />
            <h3 className="font-semibold">Email Notifications</h3>
          </div>
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Label>Study Reminders</Label>
                <p className="mt-1 text-sm text-gray-400">Daily study schedule reminders</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-start justify-between gap-4 border-t border-white/10 pt-5">
              <div>
                <Label>Exam Alerts</Label>
                <p className="mt-1 text-sm text-gray-400">Notifications about upcoming exams</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-start justify-between gap-4 border-t border-white/10 pt-5">
              <div>
                <Label>Weekly Summary</Label>
                <p className="mt-1 text-sm text-gray-400">Weekly progress report email</p>
              </div>
              <Switch />
            </div>

            <div className="flex items-start justify-between gap-4 border-t border-white/10 pt-5">
              <div>
                <Label>Product Updates</Label>
                <p className="mt-1 text-sm text-gray-400">News about features and updates</p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-4 flex items-center gap-2 text-white">
            <BellRing className="h-4 w-4 text-cyan-300" />
            <h3 className="font-semibold">Push Notifications</h3>
          </div>
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Label>Content Ready</Label>
                <p className="mt-1 text-sm text-gray-400">When AI finishes generating content</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-start justify-between gap-4 border-t border-white/10 pt-5">
              <div>
                <Label>Study Streaks</Label>
                <p className="mt-1 text-sm text-gray-400">Daily streak achievements</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
