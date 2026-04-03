import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

type AdminRole = "ADMIN" | "SUPER_ADMIN";

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: session.user.role as AdminRole,
  };
}
