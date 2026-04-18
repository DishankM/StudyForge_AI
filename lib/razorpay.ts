import crypto from "crypto";

const requiredEnvVars = ["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "RAZORPAY_PRO_PLAN_ID"] as const;
const optionalEnvVars = ["RAZORPAY_WEBHOOK_SECRET"] as const;

const RAZORPAY_API_BASE = "https://api.razorpay.com/v1";

export type RazorpaySubscriptionResponse = {
  id: string;
  entity: "subscription";
  plan_id: string;
  customer_id?: string | null;
  status: string;
  current_start?: number | null;
  current_end?: number | null;
  charge_at?: number | null;
  start_at?: number | null;
  end_at?: number | null;
  auth_attempts?: number | null;
  total_count?: number | null;
  paid_count?: number | null;
  remaining_count?: number | null;
  quantity?: number | null;
  short_url?: string | null;
  notes?: Record<string, string>;
};

export function getRazorpayStatus() {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  const missingOptional = optionalEnvVars.filter((key) => !process.env[key]);

  return {
    configured: missing.length === 0,
    missing,
    missingOptional,
    keyId: process.env.RAZORPAY_KEY_ID ?? "",
    planId: process.env.RAZORPAY_PRO_PLAN_ID ?? "",
    webhookConfigured: Boolean(process.env.RAZORPAY_WEBHOOK_SECRET),
  };
}

function getRazorpayAuthHeader() {
  const { configured } = getRazorpayStatus();
  if (!configured) {
    throw new Error("Razorpay is not fully configured.");
  }

  const keyId = process.env.RAZORPAY_KEY_ID!;
  const keySecret = process.env.RAZORPAY_KEY_SECRET!;
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;
}

export async function razorpayRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${RAZORPAY_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: getRazorpayAuthHeader(),
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Razorpay request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function createRazorpaySubscription(params: {
  totalCount?: number;
  quantity?: number;
  customerNotify?: boolean;
  notes?: Record<string, string>;
}) {
  return razorpayRequest<RazorpaySubscriptionResponse>("/subscriptions", {
    method: "POST",
    body: JSON.stringify({
      plan_id: process.env.RAZORPAY_PRO_PLAN_ID!,
      total_count: params.totalCount ?? 12,
      quantity: params.quantity ?? 1,
      customer_notify: params.customerNotify ?? 1,
      notes: params.notes ?? {},
    }),
  });
}

export async function fetchRazorpaySubscription(subscriptionId: string) {
  return razorpayRequest<RazorpaySubscriptionResponse>(`/subscriptions/${subscriptionId}`, {
    method: "GET",
  });
}

export function verifyRazorpaySubscriptionSignature(params: {
  paymentId: string;
  subscriptionId: string;
  signature: string;
}) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    throw new Error("Razorpay key secret is missing.");
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${params.paymentId}|${params.subscriptionId}`)
    .digest("hex");

  return expected === params.signature;
}

export function verifyRazorpayWebhookSignature(payload: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("Razorpay webhook secret is missing.");
  }

  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return expected === signature;
}

export function fromUnixTimestamp(value?: number | null) {
  if (!value) return null;
  return new Date(value * 1000);
}
