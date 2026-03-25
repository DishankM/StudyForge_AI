import { auth } from "@/lib/auth";
import { generateNotes } from "@/lib/services/notes-generator";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { documentId, format, includeExamples } = body;

    if (!documentId) {
      return new NextResponse("Document ID required", { status: 400 });
    }

    const result = await generateNotes({
      documentId,
      userId: session.user.id,
      format: format || "concise",
      includeExamples: includeExamples ?? true,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Notes generation API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate notes" },
      { status: 500 }
    );
  }
}
