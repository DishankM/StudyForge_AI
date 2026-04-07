"use server";

import { headers } from "next/headers";
import { signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";
import { consumeRateLimit, getClientIp, normalizeRateLimitKey } from "@/lib/rate-limit";
import { createAuditLog } from "@/lib/audit-log";

const GENERIC_AUTH_ERROR = "Invalid credentials or account access is restricted.";
const GENERIC_EMAIL_FLOW_MESSAGE =
  "If the account exists, check your email for the next step.";

export async function login(email: string, password: string) {
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { error: GENERIC_AUTH_ERROR };
    }
    // In NextAuth v5 server actions, successful credential sign-in may not
    // always include `ok: true` in the response payload. If there is no error,
    // treat it as success.
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: GENERIC_AUTH_ERROR };
    }
    throw error;
  }
}

export async function signup(name: string, email: string, password: string) {
  try {
    const requestHeaders = headers();
    const clientIp = getClientIp(requestHeaders);
    const normalizedEmail = normalizeRateLimitKey(email);
    const [ipLimit, identityLimit] = await Promise.all([
      consumeRateLimit({
        bucket: "auth:signup:ip",
        key: clientIp,
        limit: 10,
        windowMs: 60 * 60 * 1000,
      }),
      consumeRateLimit({
        bucket: "auth:signup:identity",
        key: `${clientIp}:${normalizedEmail}`,
        limit: 5,
        windowMs: 60 * 60 * 1000,
      }),
    ]);

    if (!ipLimit.allowed || !identityLimit.allowed) {
      await createAuditLog({
        eventType: "AUTH_SIGNUP_RATE_LIMITED",
        severity: "WARN",
        ipAddress: clientIp,
        email: normalizedEmail,
        route: "/auth/signup",
        metadata: {
          ipRetryAfter: ipLimit.retryAfter,
          identityRetryAfter: identityLimit.retryAfter,
        },
      });
      return { error: `Too many signup attempts. Try again in ${Math.max(ipLimit.retryAfter, identityLimit.retryAfter)} seconds.` };
    }

    await createAuditLog({
      eventType: "AUTH_SIGNUP_ATTEMPT",
      severity: "INFO",
      ipAddress: clientIp,
      email: normalizedEmail,
      route: "/auth/signup",
    });

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(email);
        await sendVerificationEmail(
          email,
          verificationToken.token,
          existingUser.name || name || "User"
        );
        return {
          success: true,
          message: GENERIC_EMAIL_FLOW_MESSAGE,
        };
      }

      return { success: true, message: GENERIC_EMAIL_FLOW_MESSAGE };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(email, verificationToken.token, name);

    return { success: true, message: GENERIC_EMAIL_FLOW_MESSAGE };
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "Something went wrong" };
  }
}

export async function verifyEmail(token: string) {
  try {
    const hashedToken = hashToken(token);
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token: hashedToken },
    });

    if (!verificationToken) {
      return { error: "Invalid token" };
    }

    if (new Date(verificationToken.expires) < new Date()) {
      return { error: "Token has expired" };
    }

    await prisma.user.update({
      where: { email: verificationToken.email },
      data: { emailVerified: new Date() },
    });

    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    return { success: true };
  } catch (error) {
    return { error: "Something went wrong" };
  }
}

export async function resetPassword(email: string) {
  try {
    const requestHeaders = headers();
    const clientIp = getClientIp(requestHeaders);
    const normalizedEmail = normalizeRateLimitKey(email);
    const [ipLimit, identityLimit] = await Promise.all([
      consumeRateLimit({
        bucket: "auth:reset:ip",
        key: clientIp,
        limit: 8,
        windowMs: 60 * 60 * 1000,
      }),
      consumeRateLimit({
        bucket: "auth:reset:identity",
        key: `${clientIp}:${normalizedEmail}`,
        limit: 4,
        windowMs: 60 * 60 * 1000,
      }),
    ]);

    if (!ipLimit.allowed || !identityLimit.allowed) {
      await createAuditLog({
        eventType: "AUTH_PASSWORD_RESET_RATE_LIMITED",
        severity: "WARN",
        ipAddress: clientIp,
        email: normalizedEmail,
        route: "/auth/forgot-password",
        metadata: {
          ipRetryAfter: ipLimit.retryAfter,
          identityRetryAfter: identityLimit.retryAfter,
        },
      });
      return { error: `Too many reset requests. Try again in ${Math.max(ipLimit.retryAfter, identityLimit.retryAfter)} seconds.` };
    }

    await createAuditLog({
      eventType: "AUTH_PASSWORD_RESET_REQUEST",
      severity: "INFO",
      ipAddress: clientIp,
      email: normalizedEmail,
      route: "/auth/forgot-password",
    });

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: true, message: GENERIC_EMAIL_FLOW_MESSAGE };
    }

    const resetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(email, resetToken.token, user.name || "User");

    return { success: true, message: GENERIC_EMAIL_FLOW_MESSAGE };
  } catch (error) {
    return { error: "Something went wrong" };
  }
}

export async function newPassword(token: string, password: string) {
  try {
    const hashedToken = hashToken(token);
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token: hashedToken },
    });

    if (!resetToken) {
      return { error: "Invalid token" };
    }

    if (new Date(resetToken.expires) < new Date()) {
      return { error: "Token has expired" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    });

    return { success: true };
  } catch (error) {
    return { error: "Something went wrong" };
  }
}

export async function logout() {
  await signOut();
}

async function generateVerificationToken(email: string) {
  const token = crypto.randomUUID();
  const hashedToken = hashToken(token);
  const expires = new Date(Date.now() + 3600 * 1000);

  const existing = await prisma.verificationToken.findFirst({
    where: { email },
  });
  if (existing) {
    await prisma.verificationToken.delete({ where: { id: existing.id } });
  }

  return prisma.verificationToken.create({
    data: { email, token: hashedToken, expires },
  });
}

async function generatePasswordResetToken(email: string) {
  const token = crypto.randomUUID();
  const hashedToken = hashToken(token);
  const expires = new Date(Date.now() + 3600 * 1000);

  const existing = await prisma.passwordResetToken.findFirst({
    where: { email },
  });
  if (existing) {
    await prisma.passwordResetToken.delete({ where: { id: existing.id } });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  return prisma.passwordResetToken.create({
    data: { email, token: hashedToken, expires, userId: user.id },
  });
}

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
