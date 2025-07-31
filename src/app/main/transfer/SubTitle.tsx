export function Subtitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col gap-y-2 min-w-55">
      <span className="text-dark-gray text-sm font-medium">
        {title}
      </span>
      <span className="text-gray text-xs">
        {subtitle}
      </span>
    </div>
  );
}
