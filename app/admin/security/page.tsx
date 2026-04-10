import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { ChevronLeft, ChevronRight, Search, ShieldAlert, ShieldCheck, UserRound, Zap } from "lucide-react";
import { SecurityFilters } from "@/components/admin/security-filters";

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
const DEFAULT_PAGE_SIZE = 20;

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

  return <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${toneClass}`}>{children}</span>;
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

function getPageHref(searchParams: Record<string, string | undefined>, nextPage: number) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (value) {
      params.set(key, value);
    }
  }

  if (nextPage > 1) {
    params.set("page", String(nextPage));
  } else {
    params.delete("page");
  }

  const query = params.toString();
  return query ? `/admin/security?${query}` : "/admin/security";
}

function getVisiblePages(currentPage: number, totalPages: number) {
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export default async function AdminSecurityPage({
  searchParams,
}: {
  searchParams: {
    eventType?: string;
    severity?: string;
    q?: string;
    page?: string;
    start?: string;
    end?: string;
    pageSize?: string;
  };
}) {
  await requireAdmin();

  const where: any = {};
  const andFilters: any[] = [];
  const searchTerm = searchParams.q?.trim();
  const pageSize = Math.min(
    50,
    Math.max(10, Number.parseInt(searchParams.pageSize || String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE)
  );
  const currentPage = Math.max(1, Number.parseInt(searchParams.page || "1", 10) || 1);
  const skip = (currentPage - 1) * pageSize;

  if (searchParams.eventType) {
    where.eventType = searchParams.eventType;
  }

  if (searchParams.severity) {
    where.severity = searchParams.severity;
  }

  if (searchTerm) {
    andFilters.push({
      OR: [
      { email: { contains: searchTerm, mode: "insensitive" } },
      { ipAddress: { contains: searchTerm, mode: "insensitive" } },
      { route: { contains: searchTerm, mode: "insensitive" } },
      { searchQuery: { contains: searchTerm, mode: "insensitive" } },
      { eventType: { contains: searchTerm, mode: "insensitive" } },
      ],
    });
  }

  if (searchParams.start) {
    andFilters.push({
      createdAt: {
        gte: new Date(`${searchParams.start}T00:00:00.000Z`),
      },
    });
  }

  if (searchParams.end) {
    andFilters.push({
      createdAt: {
        lte: new Date(`${searchParams.end}T23:59:59.999Z`),
      },
    });
  }

  if (andFilters.length > 0) {
    where.AND = andFilters;
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
        skip,
        take: pageSize,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.auditLog.groupBy({
        by: ["eventType"],
        where,
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
      prisma.auditLog.count({ where }),
      prisma.auditLog.count({
        where: {
          AND: [
            where,
            {
              severity: {
                in: ["WARN", "ERROR", "CRITICAL"],
              },
            },
          ],
        },
      }),
      prisma.auditLog.count({
        where: {
          AND: [
            where,
            {
              eventType: {
                contains: "RATE_LIMITED",
              },
            },
          ],
        },
      }),
      prisma.auditLog.count({
        where: {
          AND: [
            where,
            {
              eventType: "SEARCH_PERFORMED",
            },
          ],
        },
      }),
    ]);
  } catch {
    setupError = true;
  }

  const totalPages = Math.max(1, Math.ceil(totalLogs / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const fromItem = totalLogs === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const toItem = Math.min(safePage * pageSize, totalLogs);
  const hasFilters = Boolean(searchParams.eventType || searchParams.severity || searchTerm || searchParams.start || searchParams.end);
  const visiblePages = getVisiblePages(safePage, totalPages);

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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-zinc-900 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">{hasFilters ? "Matching Events" : "Recent Events"}</p>
            <ShieldCheck className="h-5 w-5 text-emerald-300" />
          </div>
          <p className="mt-4 text-2xl font-bold text-white sm:text-3xl">{totalLogs}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-zinc-900 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">Warnings+</p>
            <ShieldAlert className="h-5 w-5 text-amber-300" />
          </div>
          <p className="mt-4 text-2xl font-bold text-white sm:text-3xl">{warningLogs}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-zinc-900 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">Rate Limited</p>
            <Zap className="h-5 w-5 text-pink-300" />
          </div>
          <p className="mt-4 text-2xl font-bold text-white sm:text-3xl">{rateLimitedLogs}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-zinc-900 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">Search Events</p>
            <Search className="h-5 w-5 text-violet-300" />
          </div>
          <p className="mt-4 text-2xl font-bold text-white sm:text-3xl">{searchLogs}</p>
        </div>
      </div>

      {setupError && (
        <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-5 text-sm leading-6 text-amber-100">
          The security feed UI is ready, but the `AuditLog` table is not available yet. Run Prisma schema sync so these events can be stored and displayed.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-3xl border border-white/10 bg-zinc-900 p-5 sm:p-6">
          <SecurityFilters eventOptions={EVENT_OPTIONS} severityOptions={SEVERITY_OPTIONS} />

          <div className="mt-5 flex flex-col gap-3 border-b border-white/10 pb-4 text-sm text-gray-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing {fromItem}-{toItem} of {totalLogs}
            </p>
            {hasFilters && (
              <Link href="/admin/security" className="text-pink-400 hover:text-pink-300">
                Clear filters
              </Link>
            )}
          </div>

          <div className="mt-5 space-y-3 lg:hidden">
            {logs.length === 0 && (
              <div className="rounded-2xl border border-white/10 px-5 py-10 text-center text-sm text-gray-400">
                No audit events match the current filters.
              </div>
            )}
            {logs.map((log) => (
              <article key={log.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
                <div className="flex flex-wrap gap-1.5">
                  <Badge tone={eventTone(log.eventType)}>{log.eventType}</Badge>
                  <Badge tone={severityTone(log.severity)}>{log.severity}</Badge>
                </div>
                <div className="mt-3 space-y-2.5 text-sm">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">Actor</p>
                    <p className="mt-1 text-sm font-medium text-white">{log.user?.name || log.email || "Anonymous"}</p>
                    <p className="mt-1 break-all text-[11px] text-gray-400">{log.user?.email || log.email || "No email captured"}</p>
                    {log.user?.id && (
                      <Link href={`/admin/users/${log.user.id}`} className="mt-2 inline-flex items-center gap-1 text-[11px] text-pink-400 hover:text-pink-300">
                        <UserRound className="h-3 w-3" />
                        Open user
                      </Link>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">Route</p>
                      <p className="mt-1 break-all text-[11px] text-gray-400">{log.route || "-"}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">IP</p>
                      <p className="mt-1 break-all text-[11px] text-gray-400">{log.ipAddress || "-"}</p>
                    </div>
                  </div>
                  {log.searchQuery && (
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">Query</p>
                      <p className="mt-1 line-clamp-2 break-all text-sm text-white">&ldquo;{log.searchQuery}&rdquo;</p>
                    </div>
                  )}
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">Time</p>
                    <p className="mt-1 text-[11px] text-gray-400">{new Date(log.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-5 hidden overflow-hidden rounded-2xl border border-white/10 lg:block">
            <div className="overflow-x-auto">
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
                      <td className="px-4 py-4 text-xs text-gray-400">{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {logs.length === 0 && (
              <div className="px-6 py-12 text-center text-sm text-gray-400">No audit events match the current filters.</div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-400">
                Page {safePage} of {totalPages} · {pageSize} per page
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={getPageHref(searchParams, safePage - 1)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm ${safePage <= 1 ? "pointer-events-none border-white/10 text-gray-600" : "border-white/10 text-gray-200 hover:bg-white/5"}`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Link>
                {visiblePages.map((pageNumber) => (
                  <Link
                    key={pageNumber}
                    href={getPageHref(searchParams, pageNumber)}
                    className={`inline-flex min-w-10 items-center justify-center rounded-xl border px-3 py-2 text-sm ${
                      pageNumber === safePage
                        ? "border-pink-500/40 bg-pink-500/10 text-white"
                        : "border-white/10 text-gray-200 hover:bg-white/5"
                    }`}
                  >
                    {pageNumber}
                  </Link>
                ))}
                <Link
                  href={getPageHref(searchParams, safePage + 1)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm ${safePage >= totalPages ? "pointer-events-none border-white/10 text-gray-600" : "border-white/10 text-gray-200 hover:bg-white/5"}`}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-zinc-900 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-white">Top Event Types</h2>
            <div className="mt-4 space-y-3">
              {stats.map((item) => (
                <div key={item.eventType} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="text-sm text-gray-200">{item.eventType}</span>
                  <span className="text-sm font-semibold text-white">{item._count._all}</span>
                </div>
              ))}
              {stats.length === 0 && <p className="text-sm text-gray-400">No event trends available for the current filters.</p>}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-zinc-900 p-5 sm:p-6">
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
