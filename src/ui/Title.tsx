import { m } from 'framer-motion';
import clsx from 'clsx';

export function Title({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className={clsx('flex flex-col', 'gap-y-0.5')}>
      <m.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={clsx(
          'text-dark font-semibold',
          'text-2xl/snug',
          'min-[450px]:text-3xl/tight',
          'md:text-4xl/tight'
        )}
      >
        {title}
      </m.span>
      <m.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={clsx('text-gray', 'text-sm', 'min-[450px]:text-base/normal')}
      >
        {subtitle}
      </m.span>
    </div>
  );
}
