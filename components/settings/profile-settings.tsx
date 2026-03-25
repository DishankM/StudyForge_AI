"use client";

import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

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
    <Card className="border-white/10 bg-zinc-900 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarUrl || ""} />
            <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-2xl">
              {user.name?.[0] || user.email?.[0]}
            </AvatarFallback>
          </Avatar>
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
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-2"
            disabled
          />
          <p className="mt-2 text-xs text-gray-500">Email cannot be changed</p>
        </div>

        <div className="border-t border-white/10 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Current Plan</p>
              <p className="mt-1 text-sm text-gray-400">{user.plan || "FREE"} Plan</p>
            </div>
            <Button type="button" variant="outline">
              Upgrade Plan
            </Button>
          </div>
        </div>

        <Button type="submit" disabled={isLoading}>
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
