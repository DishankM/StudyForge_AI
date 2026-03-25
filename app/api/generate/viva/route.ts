import { auth } from "@/lib/auth";
import { generateVivaQuestions } from "@/lib/services/viva-generator";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { documentId, count, depth } = body;

    if (!documentId) {
      return new NextResponse("Document ID required", { status: 400 });
    }

    const result = await generateVivaQuestions({
      documentId,
      userId: session.user.id,
      count: count || 25,
      depth: depth || "detailed",
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Viva generation API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate viva questions" },
      { status: 500 }
    );
  }
}
