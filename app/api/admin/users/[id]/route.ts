import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Plan, Role } from "@prisma/client";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentAdmin = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true, isActive: true },
    });

    if (
      !currentAdmin?.isActive ||
      (currentAdmin.role !== "ADMIN" && currentAdmin.role !== "SUPER_ADMIN")
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const role = Object.values(Role).includes(body.role) ? body.role : undefined;
    const plan = Object.values(Plan).includes(body.plan) ? body.plan : undefined;
    const isActive = typeof body.isActive === "boolean" ? body.isActive : undefined;
    const trialEndsAt =
      typeof body.trialEndsAt === "string" && body.trialEndsAt
        ? new Date(body.trialEndsAt)
        : body.trialEndsAt === null
        ? null
        : undefined;

    if (params.id === currentAdmin.id && isActive === false) {
      return NextResponse.json({ error: "You cannot deactivate your own admin account" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
      select: { role: true, email: true },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (currentAdmin.role !== "SUPER_ADMIN" && role && role !== existingUser.role) {
      return NextResponse.json({ error: "Only super admins can change roles" }, { status: 403 });
    }

    if (role === "SUPER_ADMIN" && currentAdmin.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Only super admins can assign super admin access" }, { status: 403 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        ...(role && currentAdmin.role === "SUPER_ADMIN" ? { role } : {}),
        ...(plan ? { plan } : {}),
        ...(typeof isActive === "boolean" ? { isActive } : {}),
        ...(trialEndsAt !== undefined ? { trialEndsAt } : {}),
      },
      select: {
        id: true,
        role: true,
        plan: true,
        isActive: true,
        trialEndsAt: true,
      },
    });

    return NextResponse.json({
      ...updatedUser,
      message: `Updated ${existingUser.email}`,
    });
  } catch (error) {
    console.error("Admin user update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
