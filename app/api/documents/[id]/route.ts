import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteStoredFile } from "@/lib/storage";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RouteParams = {
  params: { id: string };
};

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
      await deleteStoredFile(document.fileUrl);
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
