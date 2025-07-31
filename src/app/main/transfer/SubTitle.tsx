export function Subtitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex min-w-55 flex-col gap-y-2">
      <span className="text-dark-gray text-sm font-medium">{title}</span>
      <span className="text-gray text-xs">{subtitle}</span>
    </div>
  );
}
