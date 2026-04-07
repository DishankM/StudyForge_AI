import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validations/auth";
import { consumeRateLimit, getClientIp, normalizeRateLimitKey } from "@/lib/rate-limit";
import { createAuditLog } from "@/lib/audit-log";

export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60,
    updateAge: 60 * 60,
  },
  jwt: {
    maxAge: 12 * 60 * 60,
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
    Credentials({
      async authorize(credentials, request) {
        const validatedFields = loginSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;
        const normalizedEmail = normalizeRateLimitKey(email);
        const clientIp = getClientIp(request);

        const [ipLimit, identityLimit] = await Promise.all([
          consumeRateLimit({
            bucket: "auth:login:ip",
            key: clientIp,
            limit: 20,
            windowMs: 15 * 60 * 1000,
          }),
          consumeRateLimit({
            bucket: "auth:login:identity",
            key: `${clientIp}:${normalizedEmail}`,
            limit: 8,
            windowMs: 15 * 60 * 1000,
          }),
        ]);

        if (!ipLimit.allowed || !identityLimit.allowed) {
          await createAuditLog({
            eventType: "AUTH_LOGIN_RATE_LIMITED",
            severity: "WARN",
            ipAddress: clientIp,
            email: normalizedEmail,
            route: "/auth/login",
            metadata: {
              ipRetryAfter: ipLimit.retryAfter,
              identityRetryAfter: identityLimit.retryAfter,
            },
          });
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          await createAuditLog({
            eventType: "AUTH_LOGIN_FAILURE",
            severity: "WARN",
            ipAddress: clientIp,
            email: normalizedEmail,
            route: "/auth/login",
            metadata: {
              reason: "user_not_found_or_password_missing",
            },
          });
          return null;
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
          await createAuditLog({
            eventType: "AUTH_LOGIN_FAILURE",
            severity: "WARN",
            userId: user.id,
            ipAddress: clientIp,
            email: normalizedEmail,
            route: "/auth/login",
            metadata: {
              reason: "invalid_password",
            },
          });
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: {
            id: true,
            emailVerified: true,
            trialEndsAt: true,
            isActive: true,
          },
        });

        if (existingUser) {
          if (!existingUser.isActive) {
            return false;
          }

          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              emailVerified: existingUser.emailVerified ?? new Date(),
              trialEndsAt:
                existingUser.trialEndsAt ??
                new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });
        }

        await createAuditLog({
          eventType: "AUTH_LOGIN_SUCCESS",
          severity: "INFO",
          userId: existingUser?.id ?? user.id,
          email: user.email,
          route: "/auth/login",
          metadata: {
            provider: account.provider,
          },
        });

        return true;
      }

      if (account?.provider !== "credentials") return true;

      const existingUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (!existingUser?.isActive || !existingUser.emailVerified) {
        return false;
      }

      await createAuditLog({
        eventType: "AUTH_LOGIN_SUCCESS",
        severity: "INFO",
        userId: user.id,
        email: user.email,
        route: "/auth/login",
        metadata: {
          provider: account?.provider,
        },
      });

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (session.user) {
        session.user.name = token.name ?? null;
        session.user.email = typeof token.email === "string" ? token.email : session.user.email;
        session.user.image = token.picture ?? null;
        session.user.role = token.role === "ADMIN" || token.role === "SUPER_ADMIN" ? token.role : "USER";
      }

      return session;
    },
    async jwt({ token, user, trigger, session }) {
      // Keep jwt callback edge-safe: middleware executes this in Edge runtime,
      // where Prisma cannot run.
      if (user) {
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
        token.role = "role" in user && typeof user.role === "string" ? user.role : token.role ?? "USER";
      }
      if (trigger === "update" && session) {
        if (typeof session.name === "string") {
          token.name = session.name;
        }
        if (typeof session.image === "string") {
          token.picture = session.image;
        }
      }

      return token;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
