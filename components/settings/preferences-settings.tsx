"use client";

import { Brain, MoonStar, Settings2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PreferencesSettings({ user }: { user: any }) {
  return (
    <Card className="overflow-hidden rounded-[26px] border-white/10 bg-zinc-950/80 shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
      <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_35%)] p-5 sm:p-6">
        <div className="flex items-center gap-2 text-white">
          <Settings2 className="h-4 w-4 text-cyan-300" />
          <h2 className="text-lg font-semibold sm:text-xl">Preferences</h2>
        </div>
        <p className="mt-2 text-sm text-gray-400">Tune the default behavior of your study workspace.</p>
      </div>

      <div className="space-y-5 p-5 sm:space-y-6 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-4 flex items-center gap-2 text-white">
              <MoonStar className="h-4 w-4 text-indigo-300" />
              <h3 className="font-semibold">Workspace Look</h3>
            </div>
            <Label>Theme</Label>
            <p className="mt-1 text-sm text-gray-400">Choose your preferred theme</p>
            <Select defaultValue="dark">
              <SelectTrigger className="mt-3 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-4 flex items-center gap-2 text-white">
              <Brain className="h-4 w-4 text-pink-300" />
              <h3 className="font-semibold">Study Defaults</h3>
            </div>

            <div className="space-y-5">
              <div>
                <Label>Default Note Format</Label>
                <p className="mt-1 text-sm text-gray-400">Preferred format for generated notes</p>
                <Select defaultValue="concise">
                  <SelectTrigger className="mt-3 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="concise">Concise</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                    <SelectItem value="bullet-points">Bullet Points</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Default MCQ Difficulty</Label>
                <p className="mt-1 text-sm text-gray-400">Default difficulty for practice questions</p>
                <Select defaultValue="mixed">
                  <SelectTrigger className="mt-3 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="font-semibold text-white">Behavior Toggles</h3>
          <div className="mt-5 space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Label>Auto-generate Content</Label>
                <p className="mt-1 text-sm text-gray-400">Automatically generate notes after upload</p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-5">
              <div>
                <Label>Show MCQ Explanations</Label>
                <p className="mt-1 text-sm text-gray-400">Display explanations with practice questions</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
