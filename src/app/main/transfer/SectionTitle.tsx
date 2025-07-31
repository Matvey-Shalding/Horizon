import Dropdown from 'components/icons/main/home/dropdown';

export function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="border-main border-border flex w-full items-center justify-between border-b border-solid pb-2 min-[768px]:pb-3 min-[1024px]:pb-5">
      <div className="flex flex-col min-[640px]:gap-y-1">
        <span className="text-dark text-lg font-semibold min-[640px]:text-xl">{title}</span>
        <span className="text-gray text-sm">{subtitle}</span>
      </div>
      <Dropdown />
    </div>
  );
}
