import Dropdown from "components/icons/main/home/dropdown";

export function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="border-main border-border flex w-full justify-between border-b border-solid pb-5">
      <div className="flex flex-col gap-y-1">
        <span className="text-dark text-xl font-semibold">{title}</span>
        <span className="text-gray text-sm">{subtitle}</span>
      </div>
      <Dropdown />
    </div>
  );
}
