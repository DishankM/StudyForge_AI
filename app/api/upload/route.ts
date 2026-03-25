import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const subject = formData.get("subject") as string;
    const documentType = formData.get("documentType") as string;

    if (!file) {
      return new NextResponse("No file provided", { status: 400 });
    }

    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

    let fileUrl = "";
    if (blobToken) {
      const blob = await put(file.name, file, {
        access: "public",
      });
      fileUrl = blob.url;
    } else {
      // Local dev fallback when Vercel Blob token is not configured
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });
      const safeName = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const filePath = path.join(uploadsDir, safeName);
      await writeFile(filePath, buffer);
      fileUrl = `/uploads/${safeName}`;
    }

    const document = await prisma.document.create({
      data: {
        userId: session.user.id,
        fileName: file.name,
        fileUrl,
        fileSize: file.size,
        mimeType: file.type,
        subject,
        documentType,
      },
    });

    return NextResponse.json({
      success: true,
      document,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
