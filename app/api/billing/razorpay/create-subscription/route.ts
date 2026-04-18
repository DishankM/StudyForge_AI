import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createRazorpaySubscription, getRazorpayStatus } from "@/lib/razorpay";
import { syncBillingSubscription } from "@/lib/billing";
import { BillingSubscriptionStatus } from "@prisma/client";

export const runtime = "nodejs";

export async function POST() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const status = getRazorpayStatus();
    if (!status.configured) {
      return NextResponse.json(
        { error: `Razorpay is not configured. Missing: ${status.missing.join(", ")}` },
        { status: 500 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingActive = await prisma.billingSubscription.findFirst({
      where: {
        userId: user.id,
        status: {
          in: [
            BillingSubscriptionStatus.AUTHENTICATED,
            BillingSubscriptionStatus.ACTIVE,
            BillingSubscriptionStatus.PENDING,
            BillingSubscriptionStatus.PAUSED,
          ],
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (existingActive) {
      return NextResponse.json(
        {
          error: "You already have an active or pending subscription.",
          subscriptionId: existingActive.providerSubscriptionId,
        },
        { status: 409 }
      );
    }

    const created = await createRazorpaySubscription({
      totalCount: 12,
      quantity: 1,
      customerNotify: true,
      notes: {
        userId: user.id,
        email: user.email ?? "",
        product: "StudyForge Student Pro",
      },
    });

    await syncBillingSubscription({
      userId: user.id,
      subscription: created,
    });

    return NextResponse.json({
      keyId: status.keyId,
      subscriptionId: created.id,
      planId: created.plan_id,
      amountLabel: "Rs 149/month",
      checkout: {
        name: "StudyForge",
        description: "Student Pro monthly subscription",
        subscription_id: created.id,
        prefill: {
          name: user.name ?? "",
          email: user.email ?? "",
        },
        notes: {
          userId: user.id,
          plan: "STUDENT_PRO",
        },
        theme: {
          color: "#ec4899",
        },
      },
    });
  } catch (error: any) {
    console.error("Create Razorpay subscription error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create subscription" },
      { status: 500 }
    );
  }
}
