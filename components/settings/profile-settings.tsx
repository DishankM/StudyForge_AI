"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Camera,
  Crown,
  Loader2,
  Mail,
  Move,
  RotateCcw,
  Upload,
  User2,
  ZoomIn,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PREVIEW_SIZE = 280;
const EXPORT_SIZE = 512;

type CropDraft = {
  src: string;
  fileName: string;
  mimeType: string;
  zoom: number;
  offsetX: number;
  offsetY: number;
};

function getOutputMimeType(mimeType: string) {
  if (mimeType === "image/gif") return "image/png";
  if (mimeType === "image/jpeg" || mimeType === "image/png" || mimeType === "image/webp") {
    return mimeType;
  }
  return "image/png";
}

function getFileExtension(mimeType: string) {
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "png";
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to load selected image"));
    image.src = src;
  });
}

async function createCroppedAvatarBlob(draft: CropDraft) {
  const image = await loadImage(draft.src);
  const canvas = document.createElement("canvas");
  canvas.width = EXPORT_SIZE;
  canvas.height = EXPORT_SIZE;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Unable to prepare crop canvas");
  }

  const outputMimeType = getOutputMimeType(draft.mimeType);
  const coverScale = Math.max(EXPORT_SIZE / image.width, EXPORT_SIZE / image.height);
  const finalScale = coverScale * draft.zoom;
  const drawWidth = image.width * finalScale;
  const drawHeight = image.height * finalScale;
  const scaleFactor = EXPORT_SIZE / PREVIEW_SIZE;
  const drawX = (EXPORT_SIZE - drawWidth) / 2 + draft.offsetX * scaleFactor;
  const drawY = (EXPORT_SIZE - drawHeight) / 2 + draft.offsetY * scaleFactor;

  context.clearRect(0, 0, EXPORT_SIZE, EXPORT_SIZE);
  context.drawImage(image, drawX, drawY, drawWidth, drawHeight);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Unable to export cropped image"));
          return;
        }
        resolve(blob);
      },
      outputMimeType,
      outputMimeType === "image/jpeg" ? 0.92 : undefined
    );
  });
}

export function ProfileSettings({ user }: { user: any }) {
  const router = useRouter();
  const { update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>(user.image || "");
  const [cropDraft, setCropDraft] = useState<CropDraft | null>(null);
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

  const closeCropModal = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setCropDraft(null);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setCropDraft({
      src: previewUrl,
      fileName: file.name,
      mimeType: file.type,
      zoom: 1,
      offsetX: 0,
      offsetY: 0,
    });
  };

  const uploadCroppedAvatar = async () => {
    if (!cropDraft) return;

    setIsUploading(true);
    try {
      const blob = await createCroppedAvatarBlob(cropDraft);
      const outputMimeType = getOutputMimeType(cropDraft.mimeType);
      const outputFile = new File(
        [blob],
        `avatar.${getFileExtension(outputMimeType)}`,
        { type: outputMimeType }
      );

      const nextFormData = new FormData();
      nextFormData.append("file", outputFile);

      const response = await fetch("/api/user/avatar", {
        method: "POST",
        body: nextFormData,
      });

      if (!response.ok) throw new Error("Failed to upload avatar");

      const data = await response.json();
      setAvatarUrl(data.imageUrl || "");
      await update({ image: data.imageUrl || "" });
      toast.success("Profile photo updated");
      closeCropModal();
      router.refresh();
    } catch (error) {
      toast.error("Failed to upload profile photo");
    } finally {
      setIsUploading(false);
    }
  };

  const resetCrop = () => {
    if (!cropDraft) return;
    setCropDraft({
      ...cropDraft,
      zoom: 1,
      offsetX: 0,
      offsetY: 0,
    });
  };

  return (
    <>
      <Card className="overflow-hidden rounded-[26px] border-white/10 bg-zinc-950/80 shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
        <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.18),_transparent_35%)] p-5 sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
              <Avatar className="h-20 w-20 border border-white/10 sm:h-24 sm:w-24">
                <AvatarImage src={avatarUrl || ""} className="object-cover object-center" />
                <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-xl sm:text-2xl">
                  {user.name?.[0] || user.email?.[0]}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <h2 className="text-xl font-semibold text-white sm:text-2xl">{user.name || "Your profile"}</h2>
                <p className="mt-1 break-all text-sm text-gray-400">{user.email}</p>
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

            <div className="w-full lg:w-auto">
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
                className="w-full sm:w-auto"
              >
                <Upload className="mr-2 h-4 w-4" />
                {isUploading ? "Uploading..." : "Upload Photo"}
              </Button>
              <p className="mt-2 text-xs text-gray-500">JPG, PNG, GIF or WEBP. Max size 2MB.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-6">
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
                <p className="mt-4 text-2xl font-semibold text-white sm:text-3xl">{user.plan || "FREE"}</p>
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
                  Upload and crop your profile picture before saving so it fits neatly across the app.
                </p>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 sm:w-auto">
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

      {cropDraft && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl rounded-[28px] border border-white/10 bg-zinc-950/95 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:p-6">
            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="flex-1">
                <p className="text-sm uppercase tracking-[0.24em] text-gray-400">Crop profile photo</p>
                <h3 className="mt-2 text-xl font-semibold text-white sm:text-2xl">Adjust your avatar framing</h3>
                <p className="mt-2 text-sm text-gray-400">
                  Use the controls to zoom and reposition your photo before upload.
                </p>

                <div className="mt-6 flex justify-center">
                  <div
                    className="relative overflow-hidden rounded-[32px] border border-white/10 bg-zinc-900"
                    style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cropDraft.src}
                      alt="Crop preview"
                      className="absolute inset-0 h-full w-full object-cover"
                      style={{
                        transform: `translate(${cropDraft.offsetX}px, ${cropDraft.offsetY}px) scale(${cropDraft.zoom})`,
                        transformOrigin: "center",
                      }}
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-[32px] ring-1 ring-inset ring-white/10" />
                  </div>
                </div>
              </div>

              <div className="w-full lg:max-w-sm">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="space-y-5">
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-white">
                        <ZoomIn className="h-4 w-4 text-pink-300" />
                        <Label htmlFor="zoom-range">Zoom</Label>
                      </div>
                      <input
                        id="zoom-range"
                        type="range"
                        min="1"
                        max="2.5"
                        step="0.01"
                        value={cropDraft.zoom}
                        onChange={(e) =>
                          setCropDraft({ ...cropDraft, zoom: Number(e.target.value) })
                        }
                        className="w-full"
                      />
                    </div>

                    <div>
                      <div className="mb-2 flex items-center gap-2 text-white">
                        <Move className="h-4 w-4 text-cyan-300" />
                        <Label htmlFor="horizontal-range">Horizontal Position</Label>
                      </div>
                      <input
                        id="horizontal-range"
                        type="range"
                        min="-80"
                        max="80"
                        step="1"
                        value={cropDraft.offsetX}
                        onChange={(e) =>
                          setCropDraft({ ...cropDraft, offsetX: Number(e.target.value) })
                        }
                        className="w-full"
                      />
                    </div>

                    <div>
                      <div className="mb-2 flex items-center gap-2 text-white">
                        <Move className="h-4 w-4 text-cyan-300" />
                        <Label htmlFor="vertical-range">Vertical Position</Label>
                      </div>
                      <input
                        id="vertical-range"
                        type="range"
                        min="-80"
                        max="80"
                        step="1"
                        value={cropDraft.offsetY}
                        onChange={(e) =>
                          setCropDraft({ ...cropDraft, offsetY: Number(e.target.value) })
                        }
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button type="button" variant="outline" onClick={resetCrop}>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                    <Button type="button" variant="outline" onClick={closeCropModal}>
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={uploadCroppedAvatar}
                      disabled={isUploading}
                      className="bg-gradient-to-r from-pink-500 to-purple-600"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        "Save Crop"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
