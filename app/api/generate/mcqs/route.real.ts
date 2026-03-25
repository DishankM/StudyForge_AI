import { auth } from "@/lib/auth";
import { generateMCQs } from "@/lib/services/mcq-generator";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ ok: true, route: "/api/generate/mcqs" });
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { documentId, count, difficulty, includeExplanations } = body;

    if (!documentId) {
      return new NextResponse("Document ID required", { status: 400 });
    }

    const result = await generateMCQs({
      documentId,
      userId: session.user.id,
      count: count || 20,
      difficulty: difficulty || "mixed",
      includeExplanations: includeExplanations ?? true,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("MCQ generation API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate MCQs" },
      { status: 500 }
    );
  }
}
