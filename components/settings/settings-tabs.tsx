"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "./profile-settings";
import { PreferencesSettings } from "./preferences-settings";
import { NotificationSettings } from "./notification-settings";
import { BillingSettings } from "./billing-settings";
import { DangerZone } from "./danger-zone";

export function SettingsTabs({ user }: { user: any }) {
  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList className="border border-white/10 bg-zinc-900">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="danger">Danger Zone</TabsTrigger>
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
