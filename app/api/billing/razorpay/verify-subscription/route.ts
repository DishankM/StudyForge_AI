import { BillingVerificationSource } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fetchRazorpaySubscription, verifyRazorpaySubscriptionSignature } from "@/lib/razorpay";
import { recordBillingEvent, syncBillingSubscription } from "@/lib/billing";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const paymentId = String(body.razorpay_payment_id ?? "");
    const subscriptionId = String(body.razorpay_subscription_id ?? "");
    const signature = String(body.razorpay_signature ?? "");

    if (!paymentId || !subscriptionId || !signature) {
      return NextResponse.json({ error: "Missing verification fields" }, { status: 400 });
    }

    const signatureValid = verifyRazorpaySubscriptionSignature({
      paymentId,
      subscriptionId,
      signature,
    });

    if (!signatureValid) {
      await recordBillingEvent({
        userId: session.user.id,
        eventType: "subscription.checkout_signature_invalid",
        providerEntityId: subscriptionId,
        signatureValid: false,
        payload: body,
      });

      return NextResponse.json({ error: "Invalid Razorpay signature" }, { status: 400 });
    }

    const subscription = await fetchRazorpaySubscription(subscriptionId);

    const saved = await syncBillingSubscription({
      userId: session.user.id,
      subscription,
      paymentId,
      verificationSource: BillingVerificationSource.CHECKOUT,
    });

    await recordBillingEvent({
      userId: session.user.id,
      eventType: "subscription.checkout_verified",
      providerEntityId: subscriptionId,
      signatureValid: true,
      payload: body,
    });

    return NextResponse.json({
      success: true,
      subscription: {
        id: saved.providerSubscriptionId,
        status: saved.status,
        verifiedAt: saved.verifiedAt,
        currentEnd: saved.currentEnd,
        lastPaymentId: saved.lastPaymentId,
      },
    });
  } catch (error: any) {
    console.error("Verify Razorpay subscription error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify subscription" },
      { status: 500 }
    );
  }
}
