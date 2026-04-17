const requiredEnvVars = ["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET"] as const;

export function getRazorpayStatus() {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  return {
    configured: missing.length === 0,
    missing,
  };
}
