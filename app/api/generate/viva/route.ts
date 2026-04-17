import { auth } from "@/lib/auth";
import { generateVivaQuestions } from "@/lib/services/viva-generator";
import { NextResponse } from "next/server";
import { consumeRateLimit, getClientIp } from "@/lib/rate-limit";
import { createAuditLog } from "@/lib/audit-log";
import { enforceFeatureQuota } from "@/lib/plan-enforcement";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const clientIp = getClientIp(request);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
      await enforceFeatureQuota(session.user.id, "viva");
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    const [userLimit, ipLimit] = await Promise.all([
      consumeRateLimit({
        bucket: "generate:viva:user",
        key: session.user.id,
        limit: 10,
        windowMs: 60 * 60 * 1000,
      }),
      consumeRateLimit({
        bucket: "generate:viva:ip",
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
        route: "/api/generate/viva",
        metadata: {
          type: "viva",
          userRetryAfter: userLimit.retryAfter,
          ipRetryAfter: ipLimit.retryAfter,
        },
      });
      return NextResponse.json(
        { error: `Too many viva generation requests. Try again in ${Math.max(userLimit.retryAfter, ipLimit.retryAfter)} seconds.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { documentId, count, depth, mode } = body;

    if (!documentId) {
      return new NextResponse("Document ID required", { status: 400 });
    }

    const result = await generateVivaQuestions({
      documentId,
      userId: session.user.id,
      count: count || 25,
      depth: depth || "detailed",
      mode: mode === "full" ? "full" : "fast",
    });

    await createAuditLog({
      eventType: "GENERATION_VIVA",
      severity: "INFO",
      userId: session.user.id,
      ipAddress: clientIp,
      route: "/api/generate/viva",
      targetId: documentId,
      metadata: {
        mode: mode === "full" ? "full" : "fast",
        count: count || 25,
        depth: depth || "detailed",
      },
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
