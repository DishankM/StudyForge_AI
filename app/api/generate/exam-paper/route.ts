import { auth } from "@/lib/auth";
import { generateExamPaper } from "@/lib/services/exam-paper-generator";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { title, university, subject, template, duration, totalMarks, sections, documentIds } =
      body;

    const result = await generateExamPaper({
      userId: session.user.id,
      title,
      university,
      subject,
      template,
      duration,
      totalMarks,
      sections,
      documentIds,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Exam paper generation API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate exam paper" },
      { status: 500 }
    );
  }
}
