import { BillingVerificationSource } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordBillingEvent, syncBillingSubscription } from "@/lib/billing";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay";

export const runtime = "nodejs";

type RazorpayWebhookEvent = {
  event?: string;
  account_id?: string;
  created_at?: number;
  payload?: {
    subscription?: {
      entity?: any;
    };
    payment?: {
      entity?: any;
    };
  };
};

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";

  try {
    const signatureValid = verifyRazorpayWebhookSignature(rawBody, signature);
    if (!signatureValid) {
      await recordBillingEvent({
        eventType: "webhook.signature_invalid",
        signatureValid: false,
        payload: rawBody,
      });

      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody) as RazorpayWebhookEvent;
    const subscriptionEntity = event.payload?.subscription?.entity;
    const paymentEntity = event.payload?.payment?.entity;
    const subscriptionId = subscriptionEntity?.id as string | undefined;

    let userId: string | null = null;
    if (subscriptionId) {
      const existing = await prisma.billingSubscription.findUnique({
        where: { providerSubscriptionId: subscriptionId },
        select: { userId: true },
      });
      userId = existing?.userId ?? null;
    }

    if (!userId) {
      const notesUserId = subscriptionEntity?.notes?.userId;
      if (typeof notesUserId === "string" && notesUserId.length > 0) {
        userId = notesUserId;
      }
    }

    await recordBillingEvent({
      userId,
      eventType: event.event ?? "webhook.unknown",
      providerEntityId: subscriptionId ?? null,
      providerEventId: `${event.event ?? "unknown"}:${event.created_at ?? Date.now()}`,
      signatureValid: true,
      payload: JSON.parse(rawBody),
    });

    if (userId && subscriptionEntity?.id) {
      await syncBillingSubscription({
        userId,
        subscription: subscriptionEntity,
        paymentId: typeof paymentEntity?.id === "string" ? paymentEntity.id : null,
        verificationSource: BillingVerificationSource.WEBHOOK,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook processing failed" },
      { status: 500 }
    );
  }
}
