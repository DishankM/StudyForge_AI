"use client";

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
    <Card className="space-y-6 border-white/10 bg-zinc-900 p-6">
      <div className="flex items-center justify-between">
        <div>
          <Label>Theme</Label>
          <p className="mt-1 text-sm text-gray-400">Choose your preferred theme</p>
        </div>
        <Select defaultValue="dark">
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <Label>Default Note Format</Label>
          <p className="mt-1 text-sm text-gray-400">Preferred format for generated notes</p>
        </div>
        <Select defaultValue="concise">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="concise">Concise</SelectItem>
            <SelectItem value="detailed">Detailed</SelectItem>
            <SelectItem value="bullet-points">Bullet Points</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <Label>Default MCQ Difficulty</Label>
          <p className="mt-1 text-sm text-gray-400">Default difficulty for practice questions</p>
        </div>
        <Select defaultValue="mixed">
          <SelectTrigger className="w-32">
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

      <div className="flex items-center justify-between border-t border-white/10 pt-6">
        <div>
          <Label>Auto-generate Content</Label>
          <p className="mt-1 text-sm text-gray-400">Automatically generate notes after upload</p>
        </div>
        <Switch />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <Label>Show MCQ Explanations</Label>
          <p className="mt-1 text-sm text-gray-400">Display explanations with practice questions</p>
        </div>
        <Switch defaultChecked />
      </div>
    </Card>
  );
}
