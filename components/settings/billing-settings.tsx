"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download } from "lucide-react";

export function BillingSettings({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-zinc-900 p-6">
        <h3 className="mb-4 font-semibold">Current Plan</h3>
        <div className="flex items-start justify-between">
          <div>
            <p className="mb-2 text-2xl font-bold">{user.plan || "FREE"} Plan</p>
            <p className="text-gray-400">
              {user.plan === "STUDENT_PRO" ? "₹149/month" : "No active subscription"}
            </p>
          </div>
          <Button className="bg-gradient-to-r from-pink-500 to-purple-600">Upgrade Plan</Button>
        </div>

        {user.plan !== "FREE" && (
          <div className="mt-6 border-t border-white/10 pt-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Next billing date</span>
              <span className="font-semibold">April 12, 2026</span>
            </div>
          </div>
        )}
      </Card>

      <Card className="border-white/10 bg-zinc-900 p-6">
        <h3 className="mb-4 font-semibold">Usage This Month</h3>
        <div className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-400">Document Uploads</span>
              <span className="font-semibold">15 / ∞</span>
            </div>
            <div className="h-2 w-full rounded-full bg-zinc-800">
              <div className="h-2 w-1/3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600" />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-400">AI Generations</span>
              <span className="font-semibold">42 / ∞</span>
            </div>
            <div className="h-2 w-full rounded-full bg-zinc-800">
              <div className="h-2 w-2/5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600" />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-400">Storage Used</span>
              <span className="font-semibold">2.4 GB / 10 GB</span>
            </div>
            <div className="h-2 w-full rounded-full bg-zinc-800">
              <div className="h-2 w-1/4 rounded-full bg-gradient-to-r from-pink-500 to-purple-600" />
            </div>
          </div>
        </div>
      </Card>

      <Card className="border-white/10 bg-zinc-900 p-6">
        <h3 className="mb-4 font-semibold">Billing History</h3>
        <div className="space-y-3">
          {[
            { date: "March 12, 2026", amount: "₹149", status: "Paid" },
            { date: "February 12, 2026", amount: "₹149", status: "Paid" },
            { date: "January 12, 2026", amount: "₹149", status: "Paid" },
          ].map((invoice, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-zinc-800/50 p-3">
              <div>
                <p className="font-medium">{invoice.date}</p>
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
