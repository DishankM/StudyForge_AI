import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = (await request.json()) as {
      query?: string;
      route?: string;
    };

    const query = body.query?.trim();
    const route = body.route?.trim() || "/dashboard";

    if (!query) {
      return NextResponse.json({ ok: true });
    }

    await createAuditLog({
      eventType: "SEARCH_PERFORMED",
      severity: "INFO",
      userId: session?.user?.id ?? null,
      email: session?.user?.email ?? null,
      ipAddress: getClientIp(request),
      route,
      searchQuery: query.slice(0, 200),
      metadata: {
        length: query.length,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Search audit log error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
