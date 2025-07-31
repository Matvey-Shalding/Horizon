import { Category as CategoryType } from 'types/Category.interface';

export function Category({ category }: { category: CategoryType }) {
  return (
    <div
      style={{ borderColor: category.color, color: category.color }}
      className="inline-flex items-center gap-x-1.5 rounded-2xl border-[1.5px] border-solid px-2 py-1"
    >
      <div
        style={{ background: category.color, opacity: '0.6' }}
        className="size-1.5 rounded-full"
      ></div>
      <span className="text-xs font-medium">{category.name}</span>
    </div>
  );
}
