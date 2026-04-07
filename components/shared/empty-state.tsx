import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top,rgba(236,72,153,0.12),transparent_36%),rgba(24,24,27,0.94)] p-10 text-center shadow-[0_16px_40px_rgba(0,0,0,0.22)]">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/5">
        <Icon className="h-8 w-8 text-pink-300" />
      </div>
      <h3 className="mt-5 text-2xl font-semibold text-white">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-400">{description}</p>
      {actionLabel && actionHref && (
        <div className="mt-6">
          {actionHref.startsWith("#") ? (
            <Button asChild className="bg-gradient-to-r from-pink-500 to-purple-600">
              <a href={actionHref}>{actionLabel}</a>
            </Button>
          ) : (
            <Button asChild className="bg-gradient-to-r from-pink-500 to-purple-600">
              <Link href={actionHref}>{actionLabel}</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
