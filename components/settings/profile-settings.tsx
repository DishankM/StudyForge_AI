"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Camera, Crown, Loader2, Mail, Upload, User2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProfileSettings({ user }: { user: any }) {
  const router = useRouter();
  const { update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>(user.image || "");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      toast.success("Profile updated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarSelect = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/user/avatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload avatar");

      const data = await response.json();
      setAvatarUrl(data.imageUrl || "");
      await update({ image: data.imageUrl || "" });
      toast.success("Profile photo updated");
      router.refresh();
    } catch (error) {
      toast.error("Failed to upload profile photo");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Card className="overflow-hidden rounded-[26px] border-white/10 bg-zinc-950/80 shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
      <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.18),_transparent_35%)] p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <Avatar className="h-24 w-24 border border-white/10">
              <AvatarImage src={avatarUrl || ""} />
              <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-2xl">
                {user.name?.[0] || user.email?.[0]}
              </AvatarFallback>
            </Avatar>

            <div>
              <h2 className="text-2xl font-semibold text-white">{user.name || "Your profile"}</h2>
              <p className="mt-1 text-sm text-gray-400">{user.email}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
                  Profile
                </span>
                <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs text-amber-200">
                  {user.plan || "FREE"} Plan
                </span>
              </div>
            </div>
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAvatarSelect}
              disabled={isUploading}
            >
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload Photo"}
            </Button>
            <p className="mt-2 text-xs text-gray-500">JPG, PNG or GIF. Max size 2MB.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-4 flex items-center gap-2 text-white">
                <User2 className="h-4 w-4 text-pink-300" />
                <h3 className="font-semibold">Personal Details</h3>
              </div>

              <div className="space-y-5">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10"
                      disabled
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">Email cannot be changed from settings.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-2 text-white">
                <Crown className="h-4 w-4 text-amber-300" />
                <h3 className="font-semibold">Plan Snapshot</h3>
              </div>
              <p className="mt-4 text-3xl font-semibold text-white">{user.plan || "FREE"}</p>
              <p className="mt-2 text-sm text-gray-400">
                Upgrade to unlock more generation capacity and premium study workflows.
              </p>
              <Button type="button" variant="outline" className="mt-4 w-full">
                Upgrade Plan
              </Button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-2 text-white">
                <Camera className="h-4 w-4 text-cyan-300" />
                <h3 className="font-semibold">Profile Photo</h3>
              </div>
              <p className="mt-3 text-sm text-gray-400">
                A clear profile image helps keep your workspace and account area feeling personal.
              </p>
            </div>
          </div>
        </div>

        <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-pink-500 to-purple-600">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </Card>
  );
}
