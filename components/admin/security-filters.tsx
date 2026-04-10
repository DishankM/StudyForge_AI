"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const AUTO_SUBMIT_DELAY = 350;

function formatDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function SecurityFilters({
  eventOptions,
  severityOptions,
}: {
  eventOptions: readonly string[];
  severityOptions: readonly string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [eventType, setEventType] = useState(searchParams.get("eventType") || "");
  const [severity, setSeverity] = useState(searchParams.get("severity") || "");
  const [startDate, setStartDate] = useState(searchParams.get("start") || "");
  const [endDate, setEndDate] = useState(searchParams.get("end") || "");
  const [pageSize, setPageSize] = useState(searchParams.get("pageSize") || "20");

  const presetKey = useMemo(() => {
    if (!startDate || !endDate) {
      return "";
    }

    const today = new Date();
    const todayKey = formatDateInput(today);

    const last7Start = new Date(today);
    last7Start.setDate(today.getDate() - 6);

    const last30Start = new Date(today);
    last30Start.setDate(today.getDate() - 29);

    if (startDate === todayKey && endDate === todayKey) {
      return "today";
    }

    if (startDate === formatDateInput(last7Start) && endDate === todayKey) {
      return "last7";
    }

    if (startDate === formatDateInput(last30Start) && endDate === todayKey) {
      return "last30";
    }

    return "";
  }, [endDate, startDate]);

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
    setEventType(searchParams.get("eventType") || "");
    setSeverity(searchParams.get("severity") || "");
    setStartDate(searchParams.get("start") || "");
    setEndDate(searchParams.get("end") || "");
    setPageSize(searchParams.get("pageSize") || "20");
  }, [searchParams]);

  const nextHref = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());

    const setOrDelete = (key: string, value: string) => {
      const trimmed = value.trim();
      if (trimmed) {
        params.set(key, trimmed);
      } else {
        params.delete(key);
      }
    };

    setOrDelete("q", query);
    setOrDelete("eventType", eventType);
    setOrDelete("severity", severity);
    setOrDelete("start", startDate);
    setOrDelete("end", endDate);
    setOrDelete("pageSize", pageSize === "20" ? "" : pageSize);
    params.delete("page");

    const queryString = params.toString();
    return queryString ? `${pathname}?${queryString}` : pathname;
  }, [endDate, eventType, pageSize, pathname, query, searchParams, severity, startDate]);

  useEffect(() => {
    const currentHref = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
    if (nextHref === currentHref) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      router.replace(nextHref);
    }, AUTO_SUBMIT_DELAY);

    return () => window.clearTimeout(timeoutId);
  }, [nextHref, pathname, router, searchParams]);

  const applyPreset = (preset: "today" | "last7" | "last30") => {
    const today = new Date();
    const end = formatDateInput(today);

    if (preset === "today") {
      setStartDate(end);
      setEndDate(end);
      return;
    }

    const start = new Date(today);
    start.setDate(today.getDate() - (preset === "last7" ? 6 : 29));
    setStartDate(formatDateInput(start));
    setEndDate(end);
  };

  const clearDates = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[
          { id: "today", label: "Today" },
          { id: "last7", label: "Last 7 days" },
          { id: "last30", label: "Last 30 days" },
        ].map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => applyPreset(preset.id as "today" | "last7" | "last30")}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              presetKey === preset.id
                ? "border-pink-500/30 bg-pink-500/10 text-pink-200"
                : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
            }`}
          >
            {preset.label}
          </button>
        ))}
        {(startDate || endDate) && (
          <button
            type="button"
            onClick={clearDates}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-300 transition hover:bg-white/10"
          >
            Clear dates
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_220px_180px_170px_170px_130px]">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by email, IP, route, query..."
          className="h-11 rounded-xl border border-white/10 bg-zinc-950 px-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/40"
          style={{ colorScheme: "dark" }}
        />
        <select
          value={eventType}
          onChange={(event) => setEventType(event.target.value)}
          className="h-11 rounded-xl border border-white/10 bg-zinc-950 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500/40"
          style={{ colorScheme: "dark" }}
        >
          <option value="">All events</option>
          {eventOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select
          value={severity}
          onChange={(event) => setSeverity(event.target.value)}
          className="h-11 rounded-xl border border-white/10 bg-zinc-950 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500/40"
          style={{ colorScheme: "dark" }}
        >
          <option value="">All severities</option>
          {severityOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
          className="h-11 rounded-xl border border-white/10 bg-zinc-950 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500/40"
          style={{ colorScheme: "dark" }}
        />
        <input
          type="date"
          value={endDate}
          onChange={(event) => setEndDate(event.target.value)}
          className="h-11 rounded-xl border border-white/10 bg-zinc-950 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500/40"
          style={{ colorScheme: "dark" }}
        />
        <select
          value={pageSize}
          onChange={(event) => setPageSize(event.target.value)}
          className="h-11 rounded-xl border border-white/10 bg-zinc-950 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500/40"
          style={{ colorScheme: "dark" }}
        >
          <option value="10">10 / page</option>
          <option value="20">20 / page</option>
          <option value="50">50 / page</option>
        </select>
      </div>
    </div>
  );
}
