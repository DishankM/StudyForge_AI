import Link from "next/link";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  examples,
  helperText,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  examples?: string[];
  helperText?: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top,rgba(236,72,153,0.12),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01)),rgba(24,24,27,0.94)] p-8 text-center shadow-[0_18px_50px_rgba(0,0,0,0.24)] sm:p-10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl border border-white/10 bg-white/5 sm:h-16 sm:w-16">
        <Icon className="h-7 w-7 text-pink-300 sm:h-8 sm:w-8" />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-white sm:text-2xl">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-400">{description}</p>

      {examples && examples.length > 0 && (
        <div className="mx-auto mt-6 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.24em] text-gray-500">Try with</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {examples.map((example) => (
              <span
                key={example}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-gray-300"
              >
                {example}
              </span>
            ))}
          </div>
        </div>
      )}

      {helperText && (
        <div className="mx-auto mt-5 flex max-w-xl items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left">
          <div className="rounded-xl border border-white/10 bg-white/5 p-2">
            <Lightbulb className="h-4 w-4 text-pink-300" />
          </div>
          <p className="text-sm leading-6 text-gray-300">{helperText}</p>
        </div>
      )}

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
