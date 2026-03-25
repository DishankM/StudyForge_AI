import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const note = await prisma.note.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!note) {
      return new NextResponse("Note not found", { status: 404 });
    }

    await prisma.note.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete note error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { content, title } = body;

    const note = await prisma.note.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!note) {
      return new NextResponse("Note not found", { status: 404 });
    }

    const updatedNote = await prisma.note.update({
      where: { id: params.id },
      data: {
        content,
        title,
        wordCount: content.split(/\s+/).length,
      },
    });

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error("Update note error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
