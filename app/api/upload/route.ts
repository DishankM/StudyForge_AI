import { auth } from "@/lib/auth";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { ACCEPTED_UPLOAD_MIME_TYPES, MAX_DOCUMENT_UPLOAD_SIZE, sanitizeUploadFileName } from "@/lib/uploads";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

  if (!blobToken) {
    return new NextResponse("Blob storage is not configured", { status: 500 });
  }

  try {
    const body = (await request.json()) as HandleUploadBody;

    const jsonResponse = await handleUpload({
      token: blobToken,
      request,
      body,
      onBeforeGenerateToken: async (pathname) => ({
        allowedContentTypes: ACCEPTED_UPLOAD_MIME_TYPES,
        maximumSizeInBytes: MAX_DOCUMENT_UPLOAD_SIZE,
        addRandomSuffix: true,
        tokenPayload: JSON.stringify({
          userId: session.user.id,
          pathname: `documents/${session.user.id}/${sanitizeUploadFileName(pathname)}`,
        }),
      }),
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Upload token error:", error);
    return new NextResponse("Unable to initialize upload", { status: 400 });
  }
}
