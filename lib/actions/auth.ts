"use server";

import { signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

export async function login(email: string, password: string) {
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        return { error: "Invalid credentials" };
      }
      if (result.error === "AccessDenied") {
        return { error: "Please verify your email before logging in." };
      }
      return { error: result.error };
    }
    // In NextAuth v5 server actions, successful credential sign-in may not
    // always include `ok: true` in the response payload. If there is no error,
    // treat it as success.
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        case "AccessDenied":
          return { error: "Please verify your email before logging in." };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
}

export async function signup(name: string, email: string, password: string) {
  try {
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
          message: "Account already exists but is unverified. Verification email resent.",
        };
      }

      return { error: "Email already in use" };
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

    return { success: true, message: "Verification email sent!" };
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "Something went wrong" };
  }
}

export async function verifyEmail(token: string) {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
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
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "Email not found" };
    }

    const resetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(email, resetToken.token, user.name || "User");

    return { success: true, message: "Reset email sent!" };
  } catch (error) {
    return { error: "Something went wrong" };
  }
}

export async function newPassword(token: string, password: string) {
  try {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
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
  const expires = new Date(Date.now() + 3600 * 1000);

  const existing = await prisma.verificationToken.findFirst({
    where: { email },
  });
  if (existing) {
    await prisma.verificationToken.delete({ where: { id: existing.id } });
  }

  return prisma.verificationToken.create({
    data: { email, token, expires },
  });
}

async function generatePasswordResetToken(email: string) {
  const token = crypto.randomUUID();
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
    data: { email, token, expires, userId: user.id },
  });
}
