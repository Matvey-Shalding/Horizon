export function Label({
  onClick,
  color = "#0179fe",
  children,
  content
}: {
  onClick: () => void;
  color?: string;
    children?: React.ReactNode;
  content: string;
}) {
  return (
    <div
      onClick={onClick}
      style={{ color }}
      className={`flex cursor-pointer items-center gap-x-1`}
    >
      {children}
      <span className="text-sm font-semibold">{content}</span>
    </div>
  );
}
