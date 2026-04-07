import { auth } from "@/lib/auth";
import { generateNotes } from "@/lib/services/notes-generator";
import { NextResponse } from "next/server";
import { consumeRateLimit, getClientIp } from "@/lib/rate-limit";
import { createAuditLog } from "@/lib/audit-log";

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
        bucket: "generate:notes:user",
        key: session.user.id,
        limit: 12,
        windowMs: 60 * 60 * 1000,
      }),
      consumeRateLimit({
        bucket: "generate:notes:ip",
        key: clientIp,
        limit: 30,
        windowMs: 60 * 60 * 1000,
      }),
    ]);

    if (!userLimit.allowed || !ipLimit.allowed) {
      await createAuditLog({
        eventType: "GENERATION_RATE_LIMITED",
        severity: "WARN",
        userId: session.user.id,
        ipAddress: clientIp,
        route: "/api/generate/notes",
        metadata: {
          type: "notes",
          userRetryAfter: userLimit.retryAfter,
          ipRetryAfter: ipLimit.retryAfter,
        },
      });
      return NextResponse.json(
        { error: `Too many note generation requests. Try again in ${Math.max(userLimit.retryAfter, ipLimit.retryAfter)} seconds.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { documentId, format, includeExamples, mode } = body;

    if (!documentId) {
      return new NextResponse("Document ID required", { status: 400 });
    }

    const result = await generateNotes({
      documentId,
      userId: session.user.id,
      format: format || "concise",
      includeExamples: includeExamples ?? true,
      mode: mode === "fast" ? "fast" : "full",
    });

    await createAuditLog({
      eventType: "GENERATION_NOTES",
      severity: "INFO",
      userId: session.user.id,
      ipAddress: clientIp,
      route: "/api/generate/notes",
      targetId: documentId,
      metadata: {
        mode: mode === "fast" ? "fast" : "full",
        format: format || "concise",
      },
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
