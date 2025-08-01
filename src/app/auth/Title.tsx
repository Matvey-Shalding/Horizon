import { Logo } from 'ui/Logo';

export function Title({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col">
      <div className="mb-10">
        <Logo />
      </div>
      <div className="mb-8 flex flex-col gap-y-6">
        <span className="text-dark text-4xl/tight font-semibold">{title}</span>
        <span className="text-gray text-base/normal">{subtitle}</span>
      </div>
    </div>
  );
}
