import {
  BillingSubscriptionStatus,
  BillingVerificationSource,
  Plan,
  type Prisma,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { fromUnixTimestamp, type RazorpaySubscriptionResponse } from "@/lib/razorpay";

const activeStatuses = new Set(["authenticated", "active"]);
const cancelledStatuses = new Set(["cancelled", "completed", "expired"]);

export function mapRazorpaySubscriptionStatus(status: string): BillingSubscriptionStatus {
  switch (status) {
    case "authenticated":
      return BillingSubscriptionStatus.AUTHENTICATED;
    case "active":
      return BillingSubscriptionStatus.ACTIVE;
    case "pending":
      return BillingSubscriptionStatus.PENDING;
    case "halted":
      return BillingSubscriptionStatus.HALTED;
    case "paused":
      return BillingSubscriptionStatus.PAUSED;
    case "cancelled":
      return BillingSubscriptionStatus.CANCELLED;
    case "completed":
      return BillingSubscriptionStatus.COMPLETED;
    case "expired":
      return BillingSubscriptionStatus.EXPIRED;
    default:
      return BillingSubscriptionStatus.CREATED;
  }
}

function nextPlanFromStatus(status: string): Plan {
  if (activeStatuses.has(status)) {
    return Plan.STUDENT_PRO;
  }

  if (cancelledStatuses.has(status)) {
    return Plan.FREE;
  }

  return Plan.FREE;
}

export async function syncBillingSubscription(params: {
  userId: string;
  subscription: RazorpaySubscriptionResponse;
  paymentId?: string | null;
  verificationSource?: BillingVerificationSource;
}) {
  const { userId, subscription, paymentId, verificationSource } = params;
  const status = mapRazorpaySubscriptionStatus(subscription.status);
  const plan = nextPlanFromStatus(subscription.status);
  const verifiedAt = verificationSource ? new Date() : null;

  return prisma.$transaction(async (tx) => {
    const record = await tx.billingSubscription.upsert({
      where: { providerSubscriptionId: subscription.id },
      create: {
        userId,
        providerSubscriptionId: subscription.id,
        providerPlanId: subscription.plan_id,
        providerCustomerId: subscription.customer_id ?? null,
        status,
        verifiedAt,
        verifiedBy: verificationSource ?? null,
        lastPaymentId: paymentId ?? null,
        currentStart: fromUnixTimestamp(subscription.current_start),
        currentEnd: fromUnixTimestamp(subscription.current_end),
        chargeAt: fromUnixTimestamp(subscription.charge_at),
        startAt: fromUnixTimestamp(subscription.start_at),
        endAt: fromUnixTimestamp(subscription.end_at),
        totalCount: subscription.total_count ?? null,
        paidCount: subscription.paid_count ?? null,
        remainingCount: subscription.remaining_count ?? null,
        authAttempts: subscription.auth_attempts ?? null,
        quantity: subscription.quantity ?? null,
        shortUrl: subscription.short_url ?? null,
        rawPayload: subscription as unknown as Prisma.InputJsonValue,
      },
      update: {
        userId,
        providerPlanId: subscription.plan_id,
        providerCustomerId: subscription.customer_id ?? null,
        status,
        verifiedAt: verificationSource ? new Date() : undefined,
        verifiedBy: verificationSource ?? undefined,
        lastPaymentId: paymentId ?? undefined,
        currentStart: fromUnixTimestamp(subscription.current_start),
        currentEnd: fromUnixTimestamp(subscription.current_end),
        chargeAt: fromUnixTimestamp(subscription.charge_at),
        startAt: fromUnixTimestamp(subscription.start_at),
        endAt: fromUnixTimestamp(subscription.end_at),
        totalCount: subscription.total_count ?? null,
        paidCount: subscription.paid_count ?? null,
        remainingCount: subscription.remaining_count ?? null,
        authAttempts: subscription.auth_attempts ?? null,
        quantity: subscription.quantity ?? null,
        shortUrl: subscription.short_url ?? null,
        rawPayload: subscription as unknown as Prisma.InputJsonValue,
      },
    });

    await tx.user.update({
      where: { id: userId },
      data: { plan },
    });

    return record;
  });
}

export async function recordBillingEvent(params: {
  userId?: string | null;
  eventType: string;
  providerEntityId?: string | null;
  providerEventId?: string | null;
  payload: Prisma.InputJsonValue;
  signatureValid?: boolean | null;
}) {
  return prisma.billingEvent.create({
    data: {
      userId: params.userId ?? null,
      eventType: params.eventType,
      providerEntityId: params.providerEntityId ?? null,
      providerEventId: params.providerEventId ?? null,
      payload: params.payload,
      signatureValid: params.signatureValid ?? null,
    },
  });
}
