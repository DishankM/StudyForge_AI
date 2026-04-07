import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type AuditSeverity = "INFO" | "WARN" | "ERROR" | "CRITICAL";

export type AuditEventType =
  | "AUTH_LOGIN_SUCCESS"
  | "AUTH_LOGIN_FAILURE"
  | "AUTH_LOGIN_RATE_LIMITED"
  | "AUTH_SIGNUP_ATTEMPT"
  | "AUTH_SIGNUP_RATE_LIMITED"
  | "AUTH_PASSWORD_RESET_REQUEST"
  | "AUTH_PASSWORD_RESET_RATE_LIMITED"
  | "GENERATION_NOTES"
  | "GENERATION_MCQS"
  | "GENERATION_VIVA"
  | "GENERATION_EXAM_PAPER"
  | "GENERATION_RATE_LIMITED"
  | "SEARCH_PERFORMED";

type AuditLogInput = {
  eventType: AuditEventType;
  severity?: AuditSeverity;
  userId?: string | null;
  ipAddress?: string | null;
  email?: string | null;
  route?: string | null;
  searchQuery?: string | null;
  targetId?: string | null;
  metadata?: Record<string, unknown> | null;
};

export async function createAuditLog({
  eventType,
  severity = "INFO",
  userId,
  ipAddress,
  email,
  route,
  searchQuery,
  targetId,
  metadata,
}: AuditLogInput) {
  try {
    await prisma.auditLog.create({
      data: {
        eventType,
        severity,
        userId: userId || null,
        ipAddress: ipAddress || null,
        email: email || null,
        route: route || null,
        searchQuery: searchQuery || null,
        targetId: targetId || null,
        metadata: (metadata ?? undefined) as Prisma.InputJsonValue | undefined,
      },
    });
  } catch (error) {
    console.error("Audit log write failed:", error);
  }
}
