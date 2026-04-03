export function PageLoading({
  title = "Loading workspace",
  lines = 3,
}: {
  title?: string;
  lines?: number;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="h-10 w-72 animate-pulse rounded-xl bg-white/10" />
        <div className="h-4 w-[32rem] animate-pulse rounded bg-white/5" />
      </div>

      <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
        <p className="text-sm font-medium text-gray-300">{title}</p>
        <div className="mt-5 space-y-3">
          {Array.from({ length: lines }).map((_, index) => (
            <div key={index} className="h-20 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}
