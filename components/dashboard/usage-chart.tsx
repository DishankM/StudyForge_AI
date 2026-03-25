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

  return (
    <div className="h-full rounded-xl border border-white/10 bg-zinc-900 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Last 4 Weeks</h2>
          <p className="text-sm text-gray-400">Activity based on your real data</p>
        </div>
        <BarChart3 className="h-5 w-5 text-gray-400" />
      </div>

      {!hasActivity ? (
        <div className="rounded-lg border border-dashed border-white/10 bg-zinc-800/40 p-6 text-center text-sm text-gray-400">
          No activity yet. Upload a document or generate content to see usage.
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((point, idx) => (
            <div key={`${point.label}-${idx}`}>
              <div className="mb-1 flex items-center justify-between text-xs text-gray-400">
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
