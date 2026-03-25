import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SettingsTabs } from "@/components/settings/settings-tabs";

export default async function SettingsPage() {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-2 text-gray-400">Manage your account settings and preferences</p>
      </div>

      <SettingsTabs user={user!} />
    </div>
  );
}
