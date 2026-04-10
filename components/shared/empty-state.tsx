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
    <div className="rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top,rgba(236,72,153,0.12),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01)),rgba(24,24,27,0.94)] p-8 text-center shadow-[0_18px_50px_rgba(0,0,0,0.24)] sm:p-10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl border border-white/10 bg-white/5 sm:h-16 sm:w-16">
        <Icon className="h-7 w-7 text-pink-300 sm:h-8 sm:w-8" />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-white sm:text-2xl">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-400">{description}</p>
      {actionLabel && actionHref && (
        <div className="mt-6">
          {actionHref.startsWith("#") ? (
            <Button asChild className="w-full bg-gradient-to-r from-pink-500 to-purple-600 sm:w-auto">
              <a href={actionHref}>{actionLabel}</a>
            </Button>
          ) : (
            <Button asChild className="w-full bg-gradient-to-r from-pink-500 to-purple-600 sm:w-auto">
              <Link href={actionHref}>{actionLabel}</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
