import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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

    const document = await prisma.document.create({
      data: {
        userId: session.user.id,
        fileName,
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
