import clsx from 'clsx';
import { m } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { MAIN_ROUTES } from 'routes';
import { Button } from './Button';

export function FallBackPage({
  content,
  buttonContent,
  className,
  buttonClassName,
  onClick,
}: {
  content?: string;
  buttonContent?: string;
  className?: string;
  buttonClassName?: string;
  onClick?: () => void;
}) {
  const router = useRouter();
  return (
    <div className={clsx('flex h-screen w-full items-center justify-center px-4', className)}>
      <m.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-y-4"
      >
        <m.span
          animate={{ y: [0, -5, 0] }}
          transition={{
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 1.5,
          }}
          className="text-dark-gray inline-block max-w-130 text-center text-2xl font-semibold max-[560px]:max-w-80"
        >
          {content ? content : 'You have no banks yet'}
        </m.span>
        <m.div
          animate={{ y: [0, -5, 0] }}
          transition={{
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 1.5,
          }}
          className="w-full basis-full"
        >
          <Button
            className={buttonClassName}
            onClick={() => {
              if (onClick) {
                onClick();
              } else {
                void router.push(MAIN_ROUTES.CONNECT_BANK);
              }
            }}
            content={buttonContent ? buttonContent : 'Connect bank'}
          />
        </m.div>
      </m.div>
    </div>
  );
}
