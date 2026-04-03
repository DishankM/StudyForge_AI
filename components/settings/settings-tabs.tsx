"use client";

import { Bell, CreditCard, ShieldAlert, SlidersHorizontal, UserCircle2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BillingSettings } from "./billing-settings";
import { DangerZone } from "./danger-zone";
import { NotificationSettings } from "./notification-settings";
import { PreferencesSettings } from "./preferences-settings";
import { ProfileSettings } from "./profile-settings";

export function SettingsTabs({ user }: { user: any }) {
  const tabs = [
    { value: "profile", label: "Profile", icon: UserCircle2 },
    { value: "preferences", label: "Preferences", icon: SlidersHorizontal },
    { value: "notifications", label: "Notifications", icon: Bell },
    { value: "billing", label: "Billing", icon: CreditCard },
    { value: "danger", label: "Danger Zone", icon: ShieldAlert },
  ];

  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList className="grid h-auto grid-cols-2 gap-2 rounded-[24px] border border-white/10 bg-zinc-950/80 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.24)] md:grid-cols-5">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="flex h-auto items-center gap-2 rounded-2xl px-4 py-3 text-sm data-[state=active]:bg-white data-[state=active]:text-zinc-950"
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

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
        <BillingSettings user={user} />
      </TabsContent>

      <TabsContent value="danger">
        <DangerZone user={user} />
      </TabsContent>
    </Tabs>
  );
}
