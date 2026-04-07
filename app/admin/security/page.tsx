import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { ShieldAlert, ShieldCheck, Search, UserRound, Zap } from "lucide-react";

const EVENT_OPTIONS = [
  "AUTH_LOGIN_SUCCESS",
  "AUTH_LOGIN_FAILURE",
  "AUTH_LOGIN_RATE_LIMITED",
  "AUTH_SIGNUP_ATTEMPT",
  "AUTH_SIGNUP_RATE_LIMITED",
  "AUTH_PASSWORD_RESET_REQUEST",
  "AUTH_PASSWORD_RESET_RATE_LIMITED",
  "GENERATION_NOTES",
  "GENERATION_MCQS",
  "GENERATION_VIVA",
  "GENERATION_EXAM_PAPER",
  "GENERATION_RATE_LIMITED",
  "SEARCH_PERFORMED",
] as const;

const SEVERITY_OPTIONS = ["INFO", "WARN", "ERROR", "CRITICAL"] as const;

function Badge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "slate" | "emerald" | "amber" | "red" | "violet";
}) {
  const toneClass =
    tone === "emerald"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
      : tone === "amber"
      ? "border-amber-500/20 bg-amber-500/10 text-amber-200"
      : tone === "red"
      ? "border-red-500/20 bg-red-500/10 text-red-200"
      : tone === "violet"
      ? "border-violet-500/20 bg-violet-500/10 text-violet-200"
      : "border-white/10 bg-white/5 text-gray-200";

  return <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${toneClass}`}>{children}</span>;
}

function severityTone(severity: string) {
  if (severity === "CRITICAL" || severity === "ERROR") return "red" as const;
  if (severity === "WARN") return "amber" as const;
  return "emerald" as const;
}

function eventTone(eventType: string) {
  if (eventType.includes("RATE_LIMITED")) return "amber" as const;
  if (eventType.includes("FAILURE")) return "red" as const;
  if (eventType.startsWith("SEARCH")) return "violet" as const;
  return "slate" as const;
}

export default async function AdminSecurityPage({
  searchParams,
}: {
  searchParams: {
    eventType?: string;
    severity?: string;
    q?: string;
  };
}) {
  await requireAdmin();

  const where: any = {};
  const searchTerm = searchParams.q?.trim();

  if (searchParams.eventType) {
    where.eventType = searchParams.eventType;
  }

  if (searchParams.severity) {
    where.severity = searchParams.severity;
  }

  if (searchTerm) {
    where.OR = [
      { email: { contains: searchTerm, mode: "insensitive" } },
      { ipAddress: { contains: searchTerm, mode: "insensitive" } },
      { route: { contains: searchTerm, mode: "insensitive" } },
      { searchQuery: { contains: searchTerm, mode: "insensitive" } },
      { eventType: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  let setupError = false;
  let logs: any[] = [];
  let stats: Array<{ eventType: string; _count: { _all: number } }> = [];
  let totalLogs = 0;
  let warningLogs = 0;
  let rateLimitedLogs = 0;
  let searchLogs = 0;

  try {
    [logs, stats, totalLogs, warningLogs, rateLimitedLogs, searchLogs] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 100,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      prisma.auditLog.groupBy({
        by: ["eventType"],
        _count: {
          _all: true,
        },
        orderBy: {
          _count: {
            eventType: "desc",
          },
        },
        take: 5,
      }),
      prisma.auditLog.count(),
      prisma.auditLog.count({
        where: {
          severity: {
            in: ["WARN", "ERROR", "CRITICAL"],
          },
        },
      }),
      prisma.auditLog.count({
        where: {
          eventType: {
            contains: "RATE_LIMITED",
          },
        },
      }),
      prisma.auditLog.count({
        where: {
          eventType: "SEARCH_PERFORMED",
        },
      }),
    ]);
  } catch {
    setupError = true;
  }

  return (
    <div className="space-y-6">
      <div className="max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-red-200">
          <ShieldAlert className="h-3.5 w-3.5" />
          Security Feed
        </div>
        <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Security Activity</h1>
        <p className="mt-3 text-base leading-7 text-gray-400">
          Review authentication failures, rate-limit hits, generation abuse, and search activity in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">Total Events</p>
            <ShieldCheck className="h-5 w-5 text-emerald-300" />
          </div>
          <p className="mt-4 text-3xl font-bold text-white">{totalLogs}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">Warnings+</p>
            <ShieldAlert className="h-5 w-5 text-amber-300" />
          </div>
          <p className="mt-4 text-3xl font-bold text-white">{warningLogs}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">Rate Limited</p>
            <Zap className="h-5 w-5 text-pink-300" />
          </div>
          <p className="mt-4 text-3xl font-bold text-white">{rateLimitedLogs}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">Search Events</p>
            <Search className="h-5 w-5 text-violet-300" />
          </div>
          <p className="mt-4 text-3xl font-bold text-white">{searchLogs}</p>
        </div>
      </div>

      {setupError && (
        <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-5 text-sm leading-6 text-amber-100">
          The security feed UI is ready, but the `AuditLog` table is not available yet. Run Prisma schema sync so these events can be stored and displayed.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6">
          <form className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_220px_180px_auto]">
            <input
              type="text"
              name="q"
              defaultValue={searchParams.q || ""}
              placeholder="Search by email, IP, route, query..."
              className="h-11 rounded-xl border border-white/10 bg-zinc-950 px-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/40"
              style={{ colorScheme: "dark" }}
            />
            <select
              name="eventType"
              defaultValue={searchParams.eventType || ""}
              className="h-11 rounded-xl border border-white/10 bg-zinc-950 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500/40"
              style={{ colorScheme: "dark" }}
            >
              <option value="">All events</option>
              {EVENT_OPTIONS.map((eventType) => (
                <option key={eventType} value={eventType}>
                  {eventType}
                </option>
              ))}
            </select>
            <select
              name="severity"
              defaultValue={searchParams.severity || ""}
              className="h-11 rounded-xl border border-white/10 bg-zinc-950 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500/40"
              style={{ colorScheme: "dark" }}
            >
              <option value="">All severities</option>
              {SEVERITY_OPTIONS.map((severity) => (
                <option key={severity} value={severity}>
                  {severity}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="h-11 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 text-sm font-semibold text-white"
            >
              Filter
            </button>
          </form>

          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
            <table className="min-w-full divide-y divide-white/10 text-sm">
              <thead className="bg-white/5 text-left text-gray-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Event</th>
                  <th className="px-4 py-3 font-medium">Actor</th>
                  <th className="px-4 py-3 font-medium">Route / Query</th>
                  <th className="px-4 py-3 font-medium">IP</th>
                  <th className="px-4 py-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {logs.map((log) => (
                  <tr key={log.id} className="align-top bg-zinc-900/80 transition hover:bg-white/[0.03]">
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-2">
                        <Badge tone={eventTone(log.eventType)}>{log.eventType}</Badge>
                        <Badge tone={severityTone(log.severity)}>{log.severity}</Badge>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-300">
                      <p className="font-medium text-white">{log.user?.name || log.email || "Anonymous"}</p>
                      <p className="mt-1 text-xs text-gray-400">{log.user?.email || log.email || "No email captured"}</p>
                      {log.user?.id && (
                        <Link href={`/admin/users/${log.user.id}`} className="mt-2 inline-flex items-center gap-1 text-xs text-pink-400 hover:text-pink-300">
                          <UserRound className="h-3.5 w-3.5" />
                          Open user
                        </Link>
                      )}
                    </td>
                    <td className="px-4 py-4 text-gray-300">
                      <p className="break-all text-xs text-gray-400">{log.route || "-"}</p>
                      {log.searchQuery && <p className="mt-2 break-all text-sm text-white">&ldquo;{log.searchQuery}&rdquo;</p>}
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-400">{log.ipAddress || "-"}</td>
                    <td className="px-4 py-4 text-xs text-gray-400">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {logs.length === 0 && (
              <div className="px-6 py-12 text-center text-sm text-gray-400">No audit events match the current filters.</div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6">
            <h2 className="text-lg font-semibold text-white">Top Event Types</h2>
            <div className="mt-4 space-y-3">
              {stats.map((item) => (
                <div key={item.eventType} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="text-sm text-gray-200">{item.eventType}</span>
                  <span className="text-sm font-semibold text-white">{item._count._all}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6">
            <h2 className="text-lg font-semibold text-white">What You Can Spot</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-400">
              <li>Repeated failed logins from one IP or against one email.</li>
              <li>Signup or reset flows being hammered by bots.</li>
              <li>Generation abuse through repeated rate-limit hits.</li>
              <li>What users are searching for across notes and documents.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
