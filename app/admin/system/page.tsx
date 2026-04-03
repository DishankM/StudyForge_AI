import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { Database, KeyRound, Mail, Cloud, Shield, LockKeyhole } from "lucide-react";

function HealthCard({
  title,
  status,
  detail,
  icon: Icon,
}: {
  title: string;
  status: "healthy" | "warning";
  detail: string;
  icon: typeof Database;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-2.5">
            <Icon className="h-5 w-5 text-pink-300" />
          </div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        </div>
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            status === "healthy"
              ? "bg-emerald-500/10 text-emerald-300"
              : "bg-yellow-500/10 text-yellow-300"
          }`}
        >
          {status === "healthy" ? "Healthy" : "Needs attention"}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-gray-400">{detail}</p>
    </div>
  );
}

export default async function AdminSystemPage() {
  await requireAdmin();

  let dbHealthy = true;
  try {
    await prisma.user.count();
  } catch {
    dbHealthy = false;
  }

  const serviceChecks = [
    {
      title: "Database",
      status: dbHealthy ? "healthy" : "warning",
      icon: Database,
      detail: dbHealthy
        ? "Prisma can query the database successfully."
        : "Database query failed during the latest health check.",
    },
    {
      title: "Groq API",
      status: process.env.GROQ_API_KEY ? "healthy" : "warning",
      icon: KeyRound,
      detail: process.env.GROQ_API_KEY
        ? "Groq API key is configured."
        : "Missing GROQ_API_KEY in environment variables.",
    },
    {
      title: "Brevo Email",
      status: process.env.BREVO_API_KEY && process.env.BREVO_SENDER_EMAIL ? "healthy" : "warning",
      icon: Mail,
      detail:
        process.env.BREVO_API_KEY && process.env.BREVO_SENDER_EMAIL
          ? "Brevo API key and sender identity are configured."
          : "Brevo email configuration is incomplete.",
    },
    {
      title: "Blob Storage",
      status: process.env.BLOB_READ_WRITE_TOKEN ? "healthy" : "warning",
      icon: Cloud,
      detail: process.env.BLOB_READ_WRITE_TOKEN
        ? "Blob storage token is configured."
        : "Missing BLOB_READ_WRITE_TOKEN for document uploads.",
    },
    {
      title: "Google OAuth",
      status: process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? "healthy" : "warning",
      icon: Shield,
      detail:
        process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
          ? "Google OAuth credentials are configured."
          : "Google OAuth credentials are incomplete.",
    },
    {
      title: "NextAuth",
      status: process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_URL ? "healthy" : "warning",
      icon: LockKeyhole,
      detail:
        process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_URL
          ? "Authentication secret and base URL are set."
          : "Authentication environment variables are incomplete.",
    },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">System Health</h1>
        <p className="mt-3 text-base leading-7 text-gray-400">Check environment configuration and core service readiness.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {serviceChecks.map((service) => (
          <HealthCard
            key={service.title}
            title={service.title}
            status={service.status}
            detail={service.detail}
            icon={service.icon}
          />
        ))}
      </div>
    </div>
  );
}
