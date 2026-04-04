import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteStoredFile } from "@/lib/storage";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import path from "path";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/gif", "image/webp"]);

function getSafeExtension(fileName: string, mimeType: string) {
  const ext = path.extname(fileName).toLowerCase();
  if (ext) return ext;
  if (mimeType === "image/png") return ".png";
  if (mimeType === "image/jpeg") return ".jpg";
  if (mimeType === "image/gif") return ".gif";
  if (mimeType === "image/webp") return ".webp";
  return ".png";
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return new NextResponse("File is required", { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return new NextResponse("Unsupported file type", { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return new NextResponse("File too large", { status: 400 });
    }

    const ext = getSafeExtension(file.name, file.type);
    const fileName = `${randomUUID()}${ext}`;
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

    if (!blobToken) {
      return new NextResponse("Blob storage is not configured", { status: 500 });
    }

    const blob = await put(`avatars/${session.user.id}/${fileName}`, file, {
      access: "public",
      token: blobToken,
      addRandomSuffix: false,
    });

    const imageUrl = blob.url;

    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true },
    });

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { image: imageUrl },
    });

    try {
      await deleteStoredFile(existingUser?.image ?? null);
    } catch {
      // ignore cleanup failures for replaced avatars
    }

    return NextResponse.json({ imageUrl, user });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
