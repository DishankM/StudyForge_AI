import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { consumeRateLimit, getClientIp } from "@/lib/rate-limit";
import { createAuditLog } from "@/lib/audit-log";
import { generateRevisionRoadmap } from "@/lib/services/revision-roadmap-generator";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const clientIp = getClientIp(request);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const [userLimit, ipLimit] = await Promise.all([
      consumeRateLimit({
        bucket: "generate:revision-roadmap:user",
        key: session.user.id,
        limit: 8,
        windowMs: 60 * 60 * 1000,
      }),
      consumeRateLimit({
        bucket: "generate:revision-roadmap:ip",
        key: clientIp,
        limit: 16,
        windowMs: 60 * 60 * 1000,
      }),
    ]);

    if (!userLimit.allowed || !ipLimit.allowed) {
      await createAuditLog({
        eventType: "GENERATION_RATE_LIMITED",
        severity: "WARN",
        userId: session.user.id,
        ipAddress: clientIp,
        route: "/api/generate/revision-roadmap",
        metadata: {
          type: "revision-roadmap",
          userRetryAfter: userLimit.retryAfter,
          ipRetryAfter: ipLimit.retryAfter,
        },
      });

      return NextResponse.json(
        {
          error: `Too many revision roadmap requests. Try again in ${Math.max(userLimit.retryAfter, ipLimit.retryAfter)} seconds.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = await generateRevisionRoadmap({
      userId: session.user.id,
      documentId: body.documentId,
      subjectName: body.subjectName,
      examDate: body.examDate,
      studyHoursPerDay: body.studyHoursPerDay,
      preparationLevel: body.preparationLevel,
      syllabusText: body.syllabusText,
      examPattern: body.examPattern,
      focusAreas: body.focusAreas,
    });

    const saved = await prisma.revisionRoadmap.create({
      data: {
        userId: session.user.id,
        documentId: body.documentId || null,
        title: result.roadmap.roadmapTitle,
        subjectName: body.subjectName,
        examDate: new Date(body.examDate),
        studyHoursPerDay: body.studyHoursPerDay,
        preparationLevel: body.preparationLevel,
        daysUntilExam: result.daysUntilExam,
        roadmap: result.roadmap as object,
      },
    });

    await createAuditLog({
      eventType: "GENERATION_REVISION_ROADMAP",
      severity: "INFO",
      userId: session.user.id,
      ipAddress: clientIp,
      route: "/api/generate/revision-roadmap",
      targetId: saved.id,
      metadata: {
        subjectName: body.subjectName,
        examDate: body.examDate,
      },
    });

    return NextResponse.json({ ...result, id: saved.id });
  } catch (error: any) {
    console.error("Revision roadmap generation API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate revision roadmap" },
      { status: 500 }
    );
  }
}
