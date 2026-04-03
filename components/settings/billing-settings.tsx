"use client";

import { CheckCircle2, CreditCard, Download, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function BillingSettings({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden rounded-[26px] border-white/10 bg-zinc-950/80 shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
        <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.18),_transparent_35%)] p-6">
          <div className="flex items-center gap-2 text-white">
            <CreditCard className="h-4 w-4 text-violet-300" />
            <h2 className="text-xl font-semibold">Plan & Billing</h2>
          </div>
          <p className="mt-2 text-sm text-gray-400">Keep track of your current plan, usage, and invoices.</p>
        </div>

        <div className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-gray-400">Current plan</p>
              <p className="mt-2 text-3xl font-semibold text-white">{user.plan || "FREE"} Plan</p>
              <p className="mt-2 text-gray-400">
                {user.plan === "STUDENT_PRO" ? "₹149/month" : "No active subscription"}
              </p>
            </div>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600">Upgrade Plan</Button>
          </div>

          {user.plan !== "FREE" && (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Next billing date</span>
                <span className="font-semibold text-white">April 12, 2026</span>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card className="rounded-[26px] border-white/10 bg-zinc-950/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
        <div className="mb-5 flex items-center gap-2 text-white">
          <Gauge className="h-4 w-4 text-cyan-300" />
          <h3 className="font-semibold">Usage This Month</h3>
        </div>
        <div className="space-y-5">
          {[
            { label: "Document Uploads", value: "15 / Infinity", width: "33%" },
            { label: "AI Generations", value: "42 / Infinity", width: "40%" },
            { label: "Storage Used", value: "2.4 GB / 10 GB", width: "25%" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-gray-400">{item.label}</span>
                <span className="font-semibold text-white">{item.value}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-zinc-800">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600"
                  style={{ width: item.width }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="rounded-[26px] border-white/10 bg-zinc-950/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
        <h3 className="mb-4 font-semibold text-white">Billing History</h3>
        <div className="space-y-3">
          {[
            { date: "March 12, 2026", amount: "₹149", status: "Paid" },
            { date: "February 12, 2026", amount: "₹149", status: "Paid" },
            { date: "January 12, 2026", amount: "₹149", status: "Paid" },
          ].map((invoice) => (
            <div
              key={invoice.date}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-white">{invoice.date}</p>
                <p className="text-sm text-gray-400">{invoice.amount}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-sm text-green-500">
                  <CheckCircle2 className="h-4 w-4" />
                  {invoice.status}
                </span>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
