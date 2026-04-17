import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
  ACCEPTED_UPLOAD_MIME_TYPES,
  MAX_DOCUMENT_UPLOAD_SIZE,
  isTrustedDocumentUrl,
  sanitizeUploadFileName,
} from "@/lib/uploads";
import { enforceFeatureQuota } from "@/lib/plan-enforcement";

type UploadCompletionBody = {
  fileName?: string;
  fileUrl?: string;
  fileSize?: number;
  mimeType?: string;
  subject?: string;
  documentType?: string;
};

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
      await enforceFeatureQuota(session.user.id, "uploads");
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    const body = (await request.json()) as UploadCompletionBody;
    const fileName = body.fileName?.trim();
    const fileUrl = body.fileUrl?.trim();
    const mimeType = body.mimeType?.trim();
    const subject = body.subject?.trim() || null;
    const documentType = body.documentType?.trim() || null;
    const fileSize = typeof body.fileSize === "number" ? body.fileSize : NaN;

    if (!fileName || !fileUrl || !mimeType || !Number.isFinite(fileSize)) {
      return new NextResponse("Invalid upload payload", { status: 400 });
    }

    if (!ACCEPTED_UPLOAD_MIME_TYPES.includes(mimeType)) {
      return new NextResponse("Unsupported file type", { status: 400 });
    }

    if (fileSize <= 0 || fileSize > MAX_DOCUMENT_UPLOAD_SIZE) {
      return new NextResponse("Invalid file size", { status: 400 });
    }

    if (!isTrustedDocumentUrl(fileUrl)) {
      return new NextResponse("Invalid file location", { status: 400 });
    }

    const document = await prisma.document.create({
      data: {
        userId: session.user.id,
        fileName: sanitizeUploadFileName(fileName),
        fileUrl,
        fileSize,
        mimeType,
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
    console.error("Upload completion error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
