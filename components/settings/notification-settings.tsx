"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function NotificationSettings({ user }: { user: any }) {
  return (
    <Card className="space-y-6 border-white/10 bg-zinc-900 p-6">
      <div>
        <h3 className="mb-4 font-semibold">Email Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Study Reminders</Label>
              <p className="mt-1 text-sm text-gray-400">Daily study schedule reminders</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Exam Alerts</Label>
              <p className="mt-1 text-sm text-gray-400">Notifications about upcoming exams</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Weekly Summary</Label>
              <p className="mt-1 text-sm text-gray-400">Weekly progress report email</p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Product Updates</Label>
              <p className="mt-1 text-sm text-gray-400">News about features and updates</p>
            </div>
            <Switch />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-6">
        <h3 className="mb-4 font-semibold">Push Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Content Ready</Label>
              <p className="mt-1 text-sm text-gray-400">When AI finishes generating content</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Study Streaks</Label>
              <p className="mt-1 text-sm text-gray-400">Daily streak achievements</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>
    </Card>
  );
}
