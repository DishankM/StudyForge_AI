import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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

    const mcqSetId = params.id;
    if (!mcqSetId) {
      return new NextResponse("Missing MCQ set id", { status: 400 });
    }

    const mcqSet = await prisma.mcqSet.findFirst({
      where: {
        id: mcqSetId,
        userId: session.user.id,
      },
      select: { id: true },
    });

    if (!mcqSet) {
      return new NextResponse("MCQ set not found", { status: 404 });
    }

    await prisma.mcqSet.delete({
      where: { id: mcqSet.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete MCQ set error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
