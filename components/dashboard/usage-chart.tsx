"use client";

import { BarChart3 } from "lucide-react";

type UsagePoint = {
  label: string;
  value: number;
  total: number;
};

type UsageChartProps = {
  data: UsagePoint[];
};

export function UsageChart({ data }: UsageChartProps) {
  const hasActivity = data.some((point) => point.total > 0);
  const totalItems = data.reduce((sum, point) => sum + point.total, 0);

  return (
    <div className="h-full rounded-[26px] border border-white/10 bg-zinc-950/70 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white sm:text-xl">Last 4 Weeks</h2>
          <p className="text-sm text-gray-400">Activity based on your real data</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <BarChart3 className="h-5 w-5 text-gray-300" />
        </div>
      </div>

      <div className="mb-5 rounded-2xl border border-pink-500/15 bg-gradient-to-br from-pink-500/10 to-purple-500/10 p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-pink-200/80">Tracked output</p>
        <p className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{totalItems}</p>
        <p className="mt-1 text-sm text-gray-300">Documents and generated assets created in the recent month.</p>
      </div>

      {!hasActivity ? (
        <div className="rounded-lg border border-dashed border-white/10 bg-zinc-800/40 p-6 text-center text-sm text-gray-400">
          No activity yet. Upload a document or generate content to see usage.
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((point, idx) => (
            <div key={`${point.label}-${idx}`} className="rounded-2xl border border-white/5 bg-white/[0.03] p-3">
              <div className="mb-2 flex items-center justify-between text-xs text-gray-400">
                <span>{point.label}</span>
                <span>{point.total} items</span>
              </div>
              <div className="h-2 w-full rounded-full bg-zinc-800">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600"
                  style={{ width: `${point.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
