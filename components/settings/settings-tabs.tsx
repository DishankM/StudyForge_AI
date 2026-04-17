"use client";

import { Bell, CreditCard, ShieldAlert, SlidersHorizontal, UserCircle2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BillingSettings } from "./billing-settings";
import { DangerZone } from "./danger-zone";
import { NotificationSettings } from "./notification-settings";
import { PreferencesSettings } from "./preferences-settings";
import { ProfileSettings } from "./profile-settings";
import { useSearchParams } from "next/navigation";

export function SettingsTabs({
  user,
  usage,
  razorpayStatus,
}: {
  user: any;
  usage: {
    uploads: number;
    notes: number;
    mcqs: number;
    viva: number;
    examPapers: number;
    roadmaps: number;
  };
  razorpayStatus: {
    configured: boolean;
    missing: readonly string[];
  };
}) {
  const tabs = [
    { value: "profile", label: "Profile", icon: UserCircle2 },
    { value: "preferences", label: "Preferences", icon: SlidersHorizontal },
    { value: "notifications", label: "Notifications", icon: Bell },
    { value: "billing", label: "Billing", icon: CreditCard },
    { value: "danger", label: "Danger Zone", icon: ShieldAlert },
  ];

  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const allowedTabs = new Set(tabs.map((t) => t.value));
  const defaultTab = requestedTab && allowedTabs.has(requestedTab) ? requestedTab : "profile";

  return (
    <Tabs defaultValue={defaultTab} className="space-y-6">
      <div className="overflow-x-auto pb-2">
      <TabsList className="inline-grid h-auto min-w-max grid-flow-col gap-2 rounded-[24px] border border-white/10 bg-zinc-950/80 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.24)] md:grid-cols-5 md:min-w-0 md:w-full">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="flex h-auto min-w-[140px] items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm data-[state=active]:bg-white data-[state=active]:text-zinc-950 md:min-w-0"
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      </div>

      <TabsContent value="profile">
        <ProfileSettings user={user} />
      </TabsContent>

      <TabsContent value="preferences">
        <PreferencesSettings user={user} />
      </TabsContent>

      <TabsContent value="notifications">
        <NotificationSettings user={user} />
      </TabsContent>

      <TabsContent value="billing">
        <BillingSettings user={user} usage={usage} razorpayStatus={razorpayStatus} />
      </TabsContent>

      <TabsContent value="danger">
        <DangerZone user={user} />
      </TabsContent>
    </Tabs>
  );
}
