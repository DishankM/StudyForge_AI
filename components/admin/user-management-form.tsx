"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ShieldCheck, Sparkles, CalendarClock, UserCog } from "lucide-react";

type Role = "USER" | "ADMIN" | "SUPER_ADMIN";
type Plan = "FREE" | "STUDENT_PRO" | "INSTITUTE";

export function AdminUserManagementForm({
  user,
  currentAdminRole,
}: {
  user: {
    id: string;
    role: Role;
    plan: Plan;
    isActive: boolean;
    trialEndsAt: Date | null;
  };
  currentAdminRole: "ADMIN" | "SUPER_ADMIN";
}) {
  const router = useRouter();
  const [role, setRole] = useState<Role>(user.role);
  const [plan, setPlan] = useState<Plan>(user.plan);
  const [isActive, setIsActive] = useState(user.isActive);
  const [trialEndsAt, setTrialEndsAt] = useState(
    user.trialEndsAt ? new Date(user.trialEndsAt).toISOString().slice(0, 10) : ""
  );
  const [isSaving, setIsSaving] = useState(false);

  const canEditRole = currentAdminRole === "SUPER_ADMIN";

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          plan,
          isActive,
          trialEndsAt: trialEndsAt || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to update user");
      }

      toast.success("User updated successfully");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update user");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-2.5">
          <UserCog className="h-5 w-5 text-pink-300" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Manage User</h2>
          <p className="mt-1 text-sm text-gray-400">Update role, access, plan, and trial window.</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-pink-300" />
            Role
          </Label>
          <Select value={role} onValueChange={(value) => canEditRole && setRole(value as Role)}>
            <SelectTrigger className="mt-2" disabled={!canEditRole}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USER">USER</SelectItem>
              <SelectItem value="ADMIN">ADMIN</SelectItem>
              <SelectItem value="SUPER_ADMIN">SUPER_ADMIN</SelectItem>
            </SelectContent>
          </Select>
          <p className="mt-1 text-xs text-gray-500">
            {canEditRole
              ? "Super admins can promote or demote users here."
              : "Only super admins can change roles."}
          </p>
        </div>

        <div>
          <Label className="inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-pink-300" />
            Plan
          </Label>
          <Select value={plan} onValueChange={(value) => setPlan(value as Plan)}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FREE">FREE</SelectItem>
              <SelectItem value="STUDENT_PRO">STUDENT_PRO</SelectItem>
              <SelectItem value="INSTITUTE">INSTITUTE</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="inline-flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-pink-300" />
            Trial Ends
          </Label>
          <Input
            type="date"
            value={trialEndsAt}
            onChange={(event) => setTrialEndsAt(event.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label>Account Status</Label>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant={isActive ? "default" : "outline"}
              onClick={() => setIsActive(true)}
              className={!isActive ? "" : "bg-gradient-to-r from-pink-500 to-purple-600"}
            >
              Active
            </Button>
            <Button type="button" variant={!isActive ? "default" : "outline"} onClick={() => setIsActive(false)}>
              Inactive
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-stretch sm:justify-end">
        <Button onClick={handleSave} disabled={isSaving} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 sm:w-auto">
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
