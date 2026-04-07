import { auth } from "@/lib/auth";
import { generateExamPaper } from "@/lib/services/exam-paper-generator";
import { NextResponse } from "next/server";
import { consumeRateLimit, getClientIp } from "@/lib/rate-limit";
import { createAuditLog } from "@/lib/audit-log";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const clientIp = getClientIp(request);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const [userLimit, ipLimit] = await Promise.all([
      consumeRateLimit({
        bucket: "generate:exam-paper:user",
        key: session.user.id,
        limit: 6,
        windowMs: 60 * 60 * 1000,
      }),
      consumeRateLimit({
        bucket: "generate:exam-paper:ip",
        key: clientIp,
        limit: 12,
        windowMs: 60 * 60 * 1000,
      }),
    ]);

    if (!userLimit.allowed || !ipLimit.allowed) {
      await createAuditLog({
        eventType: "GENERATION_RATE_LIMITED",
        severity: "WARN",
        userId: session.user.id,
        ipAddress: clientIp,
        route: "/api/generate/exam-paper",
        metadata: {
          type: "exam-paper",
          userRetryAfter: userLimit.retryAfter,
          ipRetryAfter: ipLimit.retryAfter,
        },
      });
      return NextResponse.json(
        { error: `Too many exam paper generation requests. Try again in ${Math.max(userLimit.retryAfter, ipLimit.retryAfter)} seconds.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { title, university, subject, template, duration, totalMarks, sections, documentIds, mode } =
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
      mode: mode === "fast" ? "fast" : "full",
    });

    await createAuditLog({
      eventType: "GENERATION_EXAM_PAPER",
      severity: "INFO",
      userId: session.user.id,
      ipAddress: clientIp,
      route: "/api/generate/exam-paper",
      targetId: result.examPaper?.id,
      metadata: {
        mode: mode === "fast" ? "fast" : "full",
        documentCount: Array.isArray(documentIds) ? documentIds.length : 0,
        title,
      },
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
