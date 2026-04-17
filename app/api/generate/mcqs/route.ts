import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { consumeRateLimit, getClientIp } from "@/lib/rate-limit";
import { generateMCQs } from "@/lib/services/mcq-generator";
import { createAuditLog } from "@/lib/audit-log";
import { enforceFeatureQuota } from "@/lib/plan-enforcement";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ ok: true, route: "/api/generate/mcqs" });
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const clientIp = getClientIp(request);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
      await enforceFeatureQuota(session.user.id, "mcqs");
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    const [userLimit, ipLimit] = await Promise.all([
      consumeRateLimit({
        bucket: "generate:mcqs:user",
        key: session.user.id,
        limit: 10,
        windowMs: 60 * 60 * 1000,
      }),
      consumeRateLimit({
        bucket: "generate:mcqs:ip",
        key: clientIp,
        limit: 24,
        windowMs: 60 * 60 * 1000,
      }),
    ]);

    if (!userLimit.allowed || !ipLimit.allowed) {
      await createAuditLog({
        eventType: "GENERATION_RATE_LIMITED",
        severity: "WARN",
        userId: session.user.id,
        ipAddress: clientIp,
        route: "/api/generate/mcqs",
        metadata: {
          type: "mcqs",
          userRetryAfter: userLimit.retryAfter,
          ipRetryAfter: ipLimit.retryAfter,
        },
      });
      return NextResponse.json(
        { error: `Too many MCQ generation requests. Try again in ${Math.max(userLimit.retryAfter, ipLimit.retryAfter)} seconds.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { documentId, count, difficulty, includeExplanations, mode } = body;

    if (!documentId) {
      return new NextResponse("Document ID required", { status: 400 });
    }

    const result = await generateMCQs({
      documentId,
      userId: session.user.id,
      count: count || 20,
      difficulty: difficulty || "mixed",
      includeExplanations: includeExplanations ?? true,
      mode: mode === "full" ? "full" : "fast",
    });

    await createAuditLog({
      eventType: "GENERATION_MCQS",
      severity: "INFO",
      userId: session.user.id,
      ipAddress: clientIp,
      route: "/api/generate/mcqs",
      targetId: documentId,
      metadata: {
        mode: mode === "full" ? "full" : "fast",
        count: count || 20,
        difficulty: difficulty || "mixed",
      },
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
