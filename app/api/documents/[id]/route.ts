import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

type RouteParams = {
  params: { id: string };
};

async function deleteLocalUpload(fileUrl: string) {
  if (!fileUrl) return;
  if (!fileUrl.startsWith("/uploads/") && !fileUrl.startsWith("uploads/")) return;

  const relativePath = fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl;
  const filePath = path.join(process.cwd(), "public", relativePath);

  try {
    await unlink(filePath);
  } catch (error: any) {
    if (error?.code !== "ENOENT") {
      throw error;
    }
  }
}

async function deleteRemoteBlob(fileUrl: string) {
  if (!fileUrl) return;
  if (!fileUrl.startsWith("http://") && !fileUrl.startsWith("https://")) return;
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;

  await del(fileUrl);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const documentId = params.id;
    if (!documentId) {
      return new NextResponse("Missing document id", { status: 400 });
    }

    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId: session.user.id,
      },
      select: {
        id: true,
        fileUrl: true,
      },
    });

    if (!document) {
      return new NextResponse("Document not found", { status: 404 });
    }

    try {
      await deleteRemoteBlob(document.fileUrl);
      await deleteLocalUpload(document.fileUrl);
    } catch (error) {
      console.warn("Failed to delete document file:", error);
    }

    await prisma.document.delete({
      where: { id: document.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete document error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
