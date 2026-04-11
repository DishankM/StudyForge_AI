import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RouteParams = {
  params: { id: string };
};

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return new NextResponse("Missing id", { status: 400 });
    }

    const record = await prisma.revisionRoadmap.findFirst({
      where: { id, userId: session.user.id },
      include: {
        document: { select: { id: true, fileName: true, subject: true } },
      },
    });

    if (!record) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json(record);
  } catch (error) {
    console.error("GET revision roadmap error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return new NextResponse("Missing id", { status: 400 });
    }

    const existing = await prisma.revisionRoadmap.findFirst({
      where: { id, userId: session.user.id },
      select: { id: true },
    });

    if (!existing) {
      return new NextResponse("Not found", { status: 404 });
    }

    await prisma.revisionRoadmap.delete({ where: { id: existing.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE revision roadmap error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
