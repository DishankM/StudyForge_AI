import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import path from "path";
import { mkdir, unlink, writeFile } from "fs/promises";

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

async function deleteLocalAvatar(fileUrl: string | null) {
  if (!fileUrl) return;
  if (!fileUrl.startsWith("/uploads/avatars/")) return;
  const localPath = path.join(process.cwd(), "public", fileUrl);
  try {
    await unlink(localPath);
  } catch {
    // ignore missing file
  }
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
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "avatars");
    await mkdir(uploadsDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadsDir, fileName), buffer);

    const imageUrl = `/uploads/avatars/${fileName}`;

    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true },
    });

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { image: imageUrl },
    });

    await deleteLocalAvatar(existingUser?.image ?? null);

    return NextResponse.json({ imageUrl, user });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
